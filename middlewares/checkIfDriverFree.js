const Truck = require('../models/Truck');
module.exports.ifDriverFree = async (req, res, next) => {
    const truck = await Truck.findOne({assigned_to: req.user._id, status: 'OL'});
    if (truck && req.user.role === 'DRIVER') {
        return res.status(400).json({message: 'Driver on load'});
    } else {
        next();
    }
};
