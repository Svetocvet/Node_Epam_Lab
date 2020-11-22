const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({message: 'No authorization header found'});
    }
    const [, jwtToken] = authHeader.split(' ');
    try {
        req.user = jwt.verify(jwtToken, config.secret);
        next();
    } catch (err) {
        return res.status(400).json({message: 'Invalid JWT'});
    }
};
