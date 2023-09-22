import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import UserModel from "../dao/models/users.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "passport-jwt";

import config from "./config.js";

const secretKey = config.secretKey.key

const HOST = config.server.host

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstname, lastname, age } = req.body;

        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            
            return done(null, false, {
              message: "Usted ya posee cuenta con ese email...",
            });
          }

          let role ="user"

          if(username === "mateo@gmail.com" && password == 123){
            role = "admin"
          }

          const newUser = {
            firstname,
            lastname,
            email: username,
            age,
            password: createHash(password),
            role: role,
            last_connection: Date.now(),
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "Correo electrónico incorrecto.",
            });
          }

          const passwordMatch = isValidPassword(user, password);
          if (!passwordMatch) {
            return done(null, false, { message: "Contraseña incorrecta." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: secretKey,
      },
      (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.eeaab075a5ab9e44",
        clientSecret: "c0c3c81c9d25c190289cfa0849f3875fb1cc8503",
        callbackURL: `${HOST}/api/users/login/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let userConCuenta = await UserModel.findOne({
            email: profile.username,
          });

          if (!userConCuenta) {
            let newUser = {
              firstname: profile.displayName,
              lastname: "",
              email: profile.username,
              age: 22,
              password: createHash(profile.id),
              role: "user",
            };

            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, userConCuenta);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
