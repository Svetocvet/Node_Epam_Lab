const Load = require('../models/Load');
const Truck = require('../models/Truck');
const User = require('../models/User');
const {Types} = require('mongoose');
const {sendMail} = require('./mailController');

module.exports.getLoads = async (req, res) => {
    try {
        const {status, limit = 10, offset = 0} = req.query;
        if (req.user.role === 'DRIVER') {
            const loads = await Load.find({
                assigned_to: req.user._id,
                status: status ? status : {$ne: ''},
            }).limit(parseInt(limit)).skip(parseInt(offset));
            return res.json({loads: loads});
        } else {
            const loads = await Load.find({
                created_by: req.user._id,
                status: status ? status : {$ne: ''},
            }).limit(parseInt(limit)).skip(parseInt(offset));
            return res.json({loads: loads});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't get Loads`});
    }
};

module.exports.createLoad = async (req, res) => {
    try {
        if (!req.body.name ||
            !req.body.payload ||
            !req.body.pickup_address ||
            !req.body.delivery_address ||
            !req.body.dimensions.height ||
            !req.body.dimensions.length ||
            !req.body.dimensions.width) {
            return res.status(400).json({message: 'Missing object fields'});
        }
        const logs = [];
        const log = {message: `Load created`, date: Date.now()};
        logs.push(log);
        const newLoad = new Load({
            created_by: req.user._id,
            name: req.body.name,
            payload: req.body.payload,
            pickup_address: req.body.pickup_address,
            delivery_address: req.body.delivery_address,
            dimensions: req.body.dimensions,
            logs: logs,
        });
        await newLoad.save();

        return res.json({message: 'Load created successfully'});
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: `Couldn't create load`});
    }
};

module.exports.getActiveLoad = async (req, res) => {
    try {
        const load = await Load.findOne({assigned_to: req.user._id, status: 'ASSIGNED'});
        if (load) {
            return res.json({load: load});
        } else {
            return res.status(400).json({message: 'Missing active load'});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't find load`});
    }
};

module.exports.iterateToNextLoad = async (req, res) => {
    try {
        const arrOfStates = ['En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery'];
        const load = await Load.findOne({assigned_to: req.user._id, status: 'ASSIGNED'});
        if (load) {
            const logs = load.logs;
            const index = arrOfStates.indexOf(load.state);

            if (index === 2) {
                const log = {message: `Load state changed to 'Arrived to delivery'`, time: Date.now()};
                logs.push(log);
                await Load.findOneAndUpdate({
                    assigned_to: req.user._id,
                }, {state: 'Arrived to delivery', status: 'SHIPPED', logs: logs});
                await Truck.findOneAndUpdate({assigned_to: req.user._id}, {assigned_to: '', status: ''});
                const user = await User.findOne({_id: load.created_by});
                const msg = `Load with name:${load.name} state changed to Arrived to delivery`;
                sendMail(req.user.email, `Load state changed`, msg);
                sendMail(user.email, `Load state changed`, msg);
                return res.json({message: `Load state changed to Arrived to delivery`});
            } else if (index === -1) {
                return res.status(400).json({message: 'Missing status'});
            } else {
                const log = {message: `Load state changed to ${arrOfStates[index + 1]}`, date: Date.now()};
                logs.push(log);
                await Load.findOneAndUpdate({
                    assigned_to: req.user._id,
                    status: 'ASSIGNED',
                }, {state: arrOfStates[index + 1], logs: logs});
                const user = await User.findOne({_id: load.created_by});
                const msg = `Load with name:${load.name} state changed to ${arrOfStates[index + 1]}`;
                sendMail(req.user.email, `Load state changed`, msg);

                sendMail(user.email, `Load state changed`, msg);
                return res.json({message: `Load state changed to ${arrOfStates[index + 1]}`});
            }
        } else {
            return res.status(400).json({message: 'Missing active load'});
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: `Couldn't find load`});
    }
};

module.exports.getLoad = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid Load id'});
        }
        const load = await Load.findOne({_id: req.params.id}).exec();
        if (!load) {
            return res.status(400).json({message: 'No load found'});
        }
        if (load.created_by == req.user._id || load.assigned_to == req.user._id) {
            return res.json({load: load});
        } else {
            return res.status(400).json({message: 'You have no access to this Load'});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't delete Load`});
    }
};

module.exports.updateLoad = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid Load id'});
        }
        const load = await Load.findOne({_id: req.params.id}).exec();
        if (!load) {
            return res.status(400).json({message: 'No load found'});
        }
        if (load.created_by != req.user._id) {
            return res.status(400).json({message: 'You have no access to this Load'});
        }
        const logs = load.logs;
        const log = {message: `Load updated`, date: Date.now()};
        logs.push(log);
        const params = {
            name: req.body.name,
            payload: req.body.payload,
            pickup_address: req.body.pickup_address,
            delivery_address: req.body.delivery_address,
            dimensions: req.body.dimensions,
            logs: logs,
        };
        for (const prop in params) if (!params[prop]) delete params[prop];
        if (!load.assigned_to && load.status === 'NEW') {
            await Load.findByIdAndUpdate({_id: req.params.id}, params);
            const msg = `Load with name:${load.name} was successfully updated}`;
            sendMail(req.user.email, `Load state changed`, msg);
            return res.json({message: 'Load details changed successfully'});
        } else {
            return res.status(400).json({message: 'This Load is already assigned'});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't delete Load`});
    }
};

module.exports.deleteLoad = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid Load id'});
        }
        const load = await Load.findOne({_id: req.params.id}).exec();
        if (!load) {
            return res.status(400).json({message: 'No load found'});
        }
        if (load.created_by != req.user._id) {
            return res.status(400).json({message: 'You have no access to this Load'});
        }
        if (load.status === 'NEW') {
            await Load.findByIdAndDelete({_id: req.params.id});
            return res.json({message: 'Load deleted successfully'});
        } else {
            return res.status(400).json({message: 'You cant delete this load, invalid status'});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't delete Load`});
    }
};

module.exports.postLoad = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'Invalid Load id'});
        }
        const load = await Load.findOne({_id: req.params.id}).exec();
        if (!load) {
            return res.status(400).json({message: 'No load found'});
        }
        if (load.created_by != req.user._id) {
            return res.status(400).json({message: 'You have no access to this Load'});
        }
        if (load.status === 'NEW') {
            const load = await Load.findOneAndUpdate({
                _id: req.params.id,
                created_by: req.user._id,
            }, {status: 'POSTED'});
            const truckModel = chooseTruck(load.payload, load.dimensions);
            if (truckModel) {
                let truck;
                if (truckModel === 1) {
                    truck = await Truck.findOneAndUpdate(
                        {status: 'IS', assigned_to: {$ne: ''}},
                        {status: 'OL'});
                } else if (truckModel === 2) {
                    truck = await Truck.findOneAndUpdate(
                        {type: {$ne: 'SPRINTER'}, status: 'IS', assigned_to: {$ne: ''}},
                        {status: 'OL'});
                } else {
                    truck = await Truck.findOneAndUpdate(
                        {type: 'LARGE STRAIGHT', status: 'IS', assigned_to: {$ne: ''}},
                        {status: 'OL'});
                }
                if (truck) {
                    const logs = load.logs;
                    const log = {message: `Load assigned to driver with id:${truck.assigned_to}`, date: Date.now()};
                    logs.push(log);
                    await Load.findOneAndUpdate({_id: req.params.id, created_by: req.user._id},
                        {
                            status: 'ASSIGNED',
                            state: 'En route to Pick Up',
                            assigned_to: truck.assigned_to,
                            logs: logs,
                        });
                    const userMsg = `Load with name:${load.name} was successfully posted`;
                    const driverMsg = `Load with name:${load.name} was successfully assigned to your truck`;
                    const driver = await User.findOne({_id: truck.assigned_to});
                    sendMail(req.user.email, `Load posted successfully`, userMsg);
                    sendMail(driver.email, `Load assigned to you`, driverMsg);
                    return res.json({message: 'Load posted successfully', driver_found: true});
                } else {
                    await Load.findOneAndUpdate({_id: req.params.id, created_by: req.user._id}, {status: 'NEW'});
                    return res.status(400).json({message: `Couldn't find truck to your load1`});
                }
            } else {
                await Load.findOneAndUpdate({_id: req.params.id, created_by: req.user._id}, {status: 'NEW'});
                return res.status(400).json({message: `Couldn't find truck to your load2`});
            }
        } else {
            return res.status(400).json({message: 'This load is in process'});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't post Load`});
    }
};

module.exports.getLoadShippingInfo = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: 'invalid load id'});
        }
        const load = await Load.findOne({_id: req.params.id}).exec();
        if (!load) {
            return res.status(400).json({message: 'No load found'});
        }
        if (load.created_by == req.user._id && load.assigned_to !== '') {
            const truck = await Truck.findOne({assigned_to: load.assigned_to}).exec();
            return res.json({load: load, truck: truck});
        } else {
            return res.status(400).json({message: 'You have no access to this Load'});
        }
    } catch (err) {
        return res.status(500).json({message: `Couldn't delete Load`});
    }
};

/**
 * Adds two numbers together.
 * @param {string} payload The first param.
 * @param {obj} dimensions The second param.
 * @return {number} model of chosen truck.
 */
function chooseTruck(payload, dimensions) {
    // const trucks = ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'];
    let truck = 0;
    if (payload <= 1700 && dimensions.width <= 300 && dimensions.length <= 250 && dimensions.height <= 170) {
        truck = 1;
    } else if (payload <= 2500 && dimensions.width <= 500 && dimensions.length <= 250 && dimensions.height <= 170) {
        truck = 2;
    } else if (payload <= 4000 && dimensions.width <= 700 && dimensions.length <= 350 && dimensions.height <= 200) {
        truck = 3;
    }
    return truck;
}
