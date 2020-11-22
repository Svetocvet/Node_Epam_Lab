const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default');
const bcrypt = require('bcryptjs');
const {salt} = require('../config/default');
const {sendMail} = require('./mailController');

module.exports.register = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        if (!email || !password || !role || !validateEmail(email)) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const hash = await bcrypt.hash(password, salt);
        const candidate = await User.findOne({email});
        if (candidate) {
            return res.status(400).json({message: 'User with this email is already exist'});
        }
        const user = new User({email: email, password: hash, role: role});
        await user.save();
        return res.json({message: 'Profile created successfully'});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
};

module.exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password || !validateEmail(email)) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const user = await User.findOne({email: email}).exec();
        if (!user) {
            return res.status(400).json({status: 'No user with such email and password found'});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({message: 'Wrong password'});
        }
        return res.json({
            status: 'Success',
            jwt_token: jwt.sign(JSON.stringify({
                _id: user.id,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl,
                createdDate: user.createdDate,
            }), config.secret),
        });
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email || !validateEmail(email)) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const user = await User.findOne({email}).exec();
        if (!user) {
            return res.status(400).json({status: 'No user with such email found'});
        }
        const newPassword = generatePassword();
        const hash = await bcrypt.hash(newPassword, salt);
        await User.findOneAndUpdate({_id: user._id}, {password: hash});
        sendMail(user.email, `Resetting Password`, `Your password has been reset to ${newPassword}`);
        return res.status(200).json({message: 'New password sent to your email address'});
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
};

/**
 * Check does email typed correctly.
 * @param {string} email email address.
 * @return {boolean} depends on validity of email.
 */
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

/**
 * Generates new password.
 * @return {string} depends on validity of email.
 */
function generatePassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

module.exports.generatePassword = generatePassword;
module.exports.validateEmail = validateEmail;
