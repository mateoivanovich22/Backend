import log from "../config/logger.js";
import jwt from 'jsonwebtoken'
import UsersManager from "../services/usersManager.js";
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

export {postRecoveryPassword, recoveryPassword, successChangePassword,bePremium, upgradePremium}