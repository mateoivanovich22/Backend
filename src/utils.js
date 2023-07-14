import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const secretKey = 'mi_clave_secreta';

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role != role) return res.status(403).send({ error: "No permissions" });
    next();
  };
};

export const generateToken = (user) => {
  const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });

  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No hay autenticacion" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, private_key, (error, credentials) => {
    if (error) return res.status(403).send({ error: "no hay autorizacion" });

    req.user = credentials.user;
    next();
  });
};

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


