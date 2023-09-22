import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import config from "./config/config.js";

import customError from "./services/errors/customError.js";
import EErors from "./services/errors/enums.js";
import {
  generateUserErrorInfo,
  loginUserErrorInfo,
} from "./services/errors/info.js";

const secretKey = config.secretKey.key;

export const notFoundURL = (req, res) => {
  return res.status(404).render("error");
};

export const privateRoute = (req, res, next) => {
  const user = req.session.user;
  if (user && (user.role === "admin" || user.role === "premium")) {
    next();
  } else {
    res.render("noPermission", {user});
  }
};

export const publicRoute = (req, res, next) => {
  if (req.session.user.role === "user" || req.user.role === "user") {
    next();
  } else {
    res.redirect("/api/products");
  }
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        const firstname = user.firstname;
        const lastname = user.lastname;
        const email = user.email;
        const password = user.password;
        const typeOfStrategy =
          strategy === "login"
            ? loginUserErrorInfo({ email, password })
            : generateUserErrorInfo({ firstname, lastname, email });
        next();
      }else{
        req.user = user;
        next();
      }
      
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.session.user.role != role) {
      return customError.createError({
        name: "No hay permisos",
        cause: "permisos denegados",
        message: `Su rol es: ${req.session.user.role}`,
        code: EErors.NO_PERMISSIONS,
      });
    }
    next();
  };
};

export const generateToken = (user) => {
  const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });

  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return customError.createError({
      name: "No hay autorizacion",
      cause: "Auth errors",
      message: `Error: ${authHeader}`,
      code: EErors.INVALID_JWT,
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, private_key, (error, credentials) => {
    if (error) {
      return customError.createError({
        name: "No hay AUTENTICACION",
        cause: "Auth errors",
        message: `Error: ${error}`,
        code: EErors.INVALID_JWT,
      });
    }

    req.user = credentials.user;
    next();
  });
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
