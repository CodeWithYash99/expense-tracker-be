const express= require("express")
 const router= express.Router();

 const authControl = require('../controllers/authController')

 router.post('/signup', authControl.postSignup)
 router.post('/login', authControl.postLogin)
 router.post('/validate-token', authControl.validateToken)
 
 module.exports= router;