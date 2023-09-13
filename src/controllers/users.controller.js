import log from "../config/logger.js";
import jwt from 'jsonwebtoken'
import UsersManager from "../services/usersManager.js";
import { generateToken } from "../utils.js";
import customError from "../services/errors/customError.js";
import EErors from "../services/errors/enums.js";
import {
  generateUserErrorInfo,
  loginUserErrorInfo
} from "../services/errors/info.js";
import nodemailer from 'nodemailer';
import config from "../config/config.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const nodemailerKey = config.nodemailer.key;

const userManager = new UsersManager();

const recoveryPassword = (req,res ) => {
    const token = req.query.token;
    res.render('recovery-password', { token });
}

const postRecoveryPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
  
    try {
      const secretKey = 'secreto';
  
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return res.status(400).send('El token no es válido o ha expirado.');
        }
        const userEmail = decoded.email;
  
        if (password !== confirmPassword) {
          return res.status(400).send('Las contraseñas no coinciden.');
        }
  
        const hashedPass = createHash(password)
  
        const newPasswordPush = await userManager.changePassword(userEmail, hashedPass)
        
        if(newPasswordPush){
          return res.redirect('/api/users/password-reset-success');
        }else{
          throw new Error
        }
        
      });
    } catch (error) {
      log.error('Error al restablecer la contraseña:', error);
      res.status(500).send('Error al restablecer la contraseña.');
    }
};

const successChangePassword = (req, res) => {
    res.render('password-reset-success');
}

const bePremium = async (req,res) => {
  const userId = req.params.uid

  const user = await userManager.findUserById(userId)

  res.render('bePremium', {user});
}

const currentJWT = (req, res) => {
  if (req.session && req.session.user) {
    const currentUserDTO = {
      firstname: req.session.user.firstname,
      email: req.session.user.email,
      age: req.session.user.age,
      lastname: req.session.user.lastname,
      role: req.session.user.role,
    };
    res.render("current", { user: currentUserDTO });
  } else {
    res.status(400).send("Usuario no autenticado");
  }
};

const showRegister = (req, res) => {
  res.render("register", { title: "Express" });
};

const postRegister = (req, res) => {
  if (!req.user) {
    const firstname = req.user.firstname;
    const lastname = req.user.lastname;
    const age = req.user.age;
    const email = req.user.email;
    const password = req.user.password;
    log.error("Error intentando acceder a su cuenta", customError.createError({
      name: "User error",
      cause: generateUserErrorInfo({
        firstname,
        lastname,
        email,
        password,
        age,
      }),
      code: EErors.INVALID_PARAM,
    }));
  } else {
    req.session.user = req.user;
    const token = generateToken(req.user);
    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
    res.redirect("/products");
  }
};

const showLogin = (req, res) => {
  res.render("login");
};

const postLogin = async (req, res) => {
  if (!req.user) {
    const email = req.user.email;
    const password = req.user.password;
    return log.error("Error intentando acceder a su cuenta", customError.createError({
      name: "User error",
      cause: loginUserErrorInfo({ email, password }),
      code: EErors.INVALID_PARAM,
    }));
  }

  const userId = req.user._id;
  try {
    await userManager.updateUserById(userId, { last_connection: new Date() });
    log.info("Last connection actualizada correctamente");
  } catch (err) {
    log.error("Error al actualizar last_connection:", err);
  }

  req.session.user = req.user;
  const token = generateToken(req.user);
  res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

  res.redirect("/api/products");
};

const githubCallback = (req, res) => {
  if (!req.user) {
    const firstname = req.user.firstname;
    const lastname = req.user.lastname;
    const age = req.user.age;
    const email = req.user.email;
    const password = req.user.password;
    return log.error("Error intentando acceder a su cuenta", customError.createError({
      name: "User error",
      cause: generateUserErrorInfo({
        firstname,
        lastname,
        email,
        password,
        age,
      }),
      code: EErors.INVALID_PARAM,
    }));
  }
  const token = generateToken(req.user);
  res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

  req.session.user = req.user;
  res.redirect("/api/products");
};

const logout = async (req, res) => {
  const userId = req.session.user._id;

  try {
    const updatedConnection = await userManager.updateUserById(userId, { last_connection: new Date() });
    if(updatedConnection){
      log.info("Connection UPDATED")
    }else{
      log.info("Connection cannot be updated")  
    }
  } catch (err) {
    log.error("Error al actualizar last_connection:", err);
  }

  req.session.destroy();
  res.redirect("/api/users/login");
};


const recovery = (req, res) => {

  res.render("recovery");
};

const postRecovery = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userManager.findUserByEmail(email);
    if (!user || user.password === password) {
      return res.status(400).send('No puede utilizar la misma contraseña.');
    }

    const token = jwt.sign({ email }, 'secreto', { expiresIn: '1h' });

    const recoveryLink = `http://localhost:8080/api/users/recovery-password?token=${token}`;

    const html = `
      <div>
        <h1>Aprete en el siguiente botón para restablecer su contraseña</h1>
        <a href="${recoveryLink}">Restablecer contraseña</a>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mateoivanovichichi@gmail.com',
        pass: nodemailerKey,
      },
    });

    const mailOptions = {
      from: 'mateoivanovichichi@gmail.com',
      to: email,
      subject: 'Recovery process',
      html: html,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        log.error("Error al enviar el correo:", err);
        return;
      }

      log.info(`Mensaje enviado con éxito a ${email}`);
    });

    res.status(200).send('Correo de recuperación enviado correctamente.');
  } catch (error) {
    log.error(error);
    res.status(500).send('Error al enviar el correo de recuperación.');
  }
};

const postDocuments = async (req, res) => {
  try {
    const userId = req.params.uid;
    const uploadedDocuments = req.body;

    const userUpdated = await userManager.updateUserDocuments(userId, uploadedDocuments);

    res.status(200).json({ message: 'Documentos cargados con éxito', user: userUpdated});
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar documentos' });
  }
}

export {postRecoveryPassword, recoveryPassword, successChangePassword,bePremium, postLogin, showLogin, postRegister, currentJWT, showRegister, githubCallback, logout, recovery, postRecovery, postDocuments}