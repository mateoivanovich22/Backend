import { Router } from "express";

import {notFoundURL, passportCall} from "../utils.js"

import upload from "../middlewares/multer.js";

import {postRecoveryPassword, recoveryPassword, successChangePassword, bePremium, postRegister, showLogin, postLogin, githubCallback, currentJWT, showRegister, logout, recovery, postRecovery, postDocuments} from "../controllers/users.controller.js"

const router = Router();

router.post("/:uid/documents", upload.array("documents", 5), postDocuments);

router.get("/current", passportCall("jwt"), currentJWT);

router.get("/", showRegister);

router.post("/register", passportCall("register"), postRegister);

router.get("/login", showLogin);

router.post("/login", passportCall("login"), postLogin);

router.get("/login/github", passportCall("github"));

router.get(
  "/login/github/callback",
  passportCall("github"),
  githubCallback
);


router.get("/logout", logout);

router.get("/recovery", recovery);

router.post("/recovery",postRecovery);

router.get('/recovery-password', recoveryPassword )

router.post('/recovery-password', postRecoveryPassword);

router.get('/password-reset-success', successChangePassword)

router.get('/premium/:uid', bePremium) 

router.all('*', notFoundURL)

export default router;
