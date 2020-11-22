const express = require('express');
const router = express.Router();

const {register, login, forgotPassword} = require('../controllers/authController');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot_password', forgotPassword);

module.exports = router;
