const express = require('express')
const { createUser, loginUser, checkUser, forgotPasswordRequest, forgotPassword, logout } = require('../Controller/Auth')
const router = express.Router()
const passport = require('passport')

router
   .post('/signup', createUser)
   .post('/login', passport.authenticate('local'), loginUser)
   .get('/check', passport.authenticate('jwt'), checkUser)
   .post('/forgot-password-request', forgotPasswordRequest)
   .post('/forgot-password', forgotPassword)
   .get('/logout', logout)

module.exports = router