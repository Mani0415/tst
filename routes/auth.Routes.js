import express from 'express'
import { BrandRegister, Login, Register } from '../controllers/auth.Controller.js'
import { validateLoginInput, validateRegisterinput } from '../middleware/validateMiddleware.js'

const router = express.Router()

router.post('/register',validateRegisterinput,Register)
router.post('/register/brand',BrandRegister)
router.get('/login',validateLoginInput,Login)

export default router