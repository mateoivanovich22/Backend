import { Router } from "express";

import {notFoundURL, passportCall, authorization} from "../utils.js"

import upload from "../middlewares/multer.js";

import {postRecoveryPassword, recoveryPassword, successChangePassword, bePremium, postRegister, showLogin, postLogin, githubCallback, currentJWT, showRegister, logout, recovery, postRecovery, postDocuments, showUsers, usersInactivity, updateRole, deleteUser, actualizarSession} from "../controllers/users.controller.js"
const router = Router();

router.get('/', authorization("admin") , showUsers);

router.post("/:uid/update-role", authorization("admin") , updateRole)

router.post("/:uid/delete-user", authorization("admin") , deleteUser)

router.delete('/', authorization("admin") ,usersInactivity); //para probar el router desde postman: quitar el "authorization("admin")"

router.post("/:uid/documents", upload.array("documents", 5), postDocuments);

router.get("/current", passportCall("jwt"), currentJWT);

router.get("/register", showRegister);

router.post("/register", passportCall("register"), postRegister);

router.get("/login", showLogin);

router.post("/login", passportCall("login"), postLogin);

router.get("/login/github", passportCall("github"));

router.get(
  "/login/github/callback",
  passportCall("github"),
  githubCallback
);

router.post("/update-user-session/:uid", actualizarSession)

router.get("/logout", logout);

router.get("/recovery", recovery);

router.post("/recovery",postRecovery);

router.get('/recovery-password', recoveryPassword )

router.post('/recovery-password', postRecoveryPassword);

router.get('/password-reset-success', successChangePassword)

router.get('/premium/:uid', bePremium) 

router.all('*', notFoundURL)

export default router;
