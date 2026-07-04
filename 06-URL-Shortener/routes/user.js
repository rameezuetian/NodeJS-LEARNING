const express = require("express")
const { handleUserSignup, handleUserLogin } = require('../controllers/user')
const router = express.Router()

router.get('/signup', (req, res) => res.render('Signup'))
router.get('/login', (req, res) => res.render('Login'))
router.post('/signup', handleUserSignup)
router.post('/login', handleUserLogin)

module.exports = router;