const Truck = require('../models/Truck');
const Load = require('../models/Load');
const {Types} = require('mongoose');

module.exports.getTrucks = async (req, res) => {
    try {
        const trucks = await Truck.find({created_by: req.user._id});
        return res.json({trucks: trucks});
    } catch (err) {
        return res.status(500).json({message: `Couldn't get trucks`});
    }
};
module.exports.getTruck = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({message: 'Missing id in body'});
        }
        const truck = await Truck.findOne({_id: req.params.id, created_by: req.user._id});
        if (!truck) {
            return res.status(400).json({message: 'Truck not found'});
        } else {
            return res.json({truck: truck});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't get truck`});
    }
};

module.exports.createTruck = async (req, res) => {
    try {
        if (!req.body.type) {
            return res.status(400).json({message: 'Missing type in body'});
        }
        const trucks = ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'];
        if (trucks.indexOf(req.body.type)===-1) {
            return res.status(400).json({message: 'Missing type'});
        }
        const newTruck = new Truck({created_by: req.user._id, type: req.body.type});
        await newTruck.save();
        return res.json({message: 'Truck created successfully'});
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: `Couldn't add Truck`});
    }
};

module.exports.editTruck = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid Truck id'});
        }
        if (!req.body.type) {
            return res.status(400).json({message: 'No type found'});
        }
        const truck = await Truck.findOne({_id: req.params.id}).exec();
        if (!truck) {
            return res.status(400).json({message: 'No truck found'});
        }
        if (truck.created_by != req.user._id|| truck.status === 'OL') {
            return res.status(400).json({message: 'You have no access to this truck'});
        }
        const trucks = ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'];
        if (trucks.indexOf(req.body.type)===-1) {
            return res.status(400).json({message: 'Missing type'});
        }
        await Truck.findByIdAndUpdate({_id: req.params.id}, {type: req.body.type});
        return res.json({message: 'Truck details changed successfully'});
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: `Couldn't edit Truck`});
    }
};

module.exports.deleteTruck = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid truck id'});
        }
        const truck = await Truck.findOne({_id: req.params.id}).exec();
        if (!truck) {
            return res.status(400).json({message: 'No truck found'});
        }
        if (truck.created_by != req.user._id|| truck.status === 'OL') {
            return res.status(400).json({message: 'You have no access to this truck'});
        }
        await Truck.findByIdAndDelete({_id: req.params.id});
        return res.json({message: 'Truck deleted successfully'});
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: `Couldn't delete truck`});
    }
};

module.exports.assignTruck = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid truck id'});
        }
        const truck = await Truck.findOne({_id: req.params.id, created_by: req.user._id}).exec();
        if (!truck) {
            return res.status(400).json({message: 'No truck found'});
        }
        const isDriverAssigned = await Load.find({assigned_to: req.user._id, status: 'ASSIGNED'});
        if (isDriverAssigned.length > 0) {
            return res.status(400).json({message: 'This driver is already assigned'});
        }
        if (truck.assigned_to === '') {
            await Truck.findOneAndUpdate({assigned_to: Types.ObjectId(req.user._id)}, {assigned_to: '', status: ''});
            await Truck.findByIdAndUpdate({_id: req.params.id}, {assigned_to: Types.ObjectId(req.user._id), status: 'IS'});
            return res.json({message: 'Truck assigned successfully'});
        } else {
            return res.status(400).json({message: 'This truck is already assigned'});
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: `Couldn't assign truck`});
    }
};
