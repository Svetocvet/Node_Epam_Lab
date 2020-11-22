const User = require('../models/User');
const Truck = require('../models/Load');
const bcrypt = require('bcryptjs');
const {salt} = require('../config/default');

module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user._id});
        if (!user) {
            return res.status(400).json({message: `Requested profile doesn't exist`});
        }
        return res.json({
            user: {
                _id: user._id,
                email: user.email,
                imageUrl: user.imageUrl,
                created_date: user.createdDate,
            },
        });
    } catch (err) {
        return res.status(500).json({message: 'Could not get profile, some error happened'});
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user._id});
        if (!user) {
            return res.status(400).json({message: `Requested profile doesn't exist`});
        } else {
            const load = await Truck.findOne({assigned_to: req.user._id, status: 'ASSIGNED'});
            if (load) {
                return res.status(400).json({message: `Driver has assigned truck`});
            } else {
                await User.findOneAndDelete({_id: req.user._id});
                return res.json({message: 'Profile deleted successfully'});
            }
        }
    } catch (err) {
        return res.status(500).json({message: 'Could not delete profile, some error happened'});
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        if (!req.body.oldPassword || !req.body.newPassword) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const user = await User.findOne({_id: req.user._id});
        if (!user) {
            return res.status(400).json({message: `Requested profile doesn't exist`});
        }
        const doPasswordsMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!doPasswordsMatch) {
            return res.status(400).json({message: `Wrong old password`});
        }
        const hash = await bcrypt.hash(req.body.newPassword, salt);
        await User.findOneAndUpdate({_id: req.user._id}, {password: hash});
        return res.json({message: 'Password changed successfully'});
    } catch (err) {
        return res.status(500).json({message: 'Could not update password, some error happened'});
    }
};

module.exports.changePhoto = async (req, res) => {
    try {
        if (!req.body.imageUrl) {
            return res.status(400).json({message: 'No imageUrl'});
        }
        const user = await User.findOne({_id: req.user._id});
        if (!user) {
            return res.status(400).json({message: `Requested profile doesn't exist`});
        }
        await User.findOneAndUpdate({_id: req.user._id}, {imageUrl: req.body.imageUrl});
        return res.json({message: 'Photo changed successfully'});
    } catch (err) {
        return res.status(500).json({message: 'Could not update password, some error happened'});
    }
};
