module.exports.driverRoleMiddleware = (req, res, next) => {
    if (req.user.role !== 'DRIVER') {
        return res.status(400).json({message: 'Missing user role'});
    } else {
        next();
    }
};

module.exports.shipperRoleMiddleware = (req, res, next) => {
    if (req.user.role !== 'SHIPPER') {
        return res.status(400).json({message: 'Missing user role'});
    } else {
        next();
    }
};

