import { Router } from "express";

import {notFoundURL} from "../utils.js"

import {postRecoveryPassword, recoveryPassword, successChangePassword, bePremium, upgradePremium} from "../controllers/users.controller.js"

const router = Router();

router.get('/')

router.get('/recovery-password', recoveryPassword )

router.post('/recovery-password', postRecoveryPassword);

router.get('/password-reset-success', successChangePassword)

router.get('/premium/:uid', bePremium) 

router.all('*', notFoundURL)

export default router;
