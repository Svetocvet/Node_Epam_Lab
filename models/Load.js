const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = mongoose.Types;
module.exports = mongoose.model('load', new Schema({
    created_by: {
        required: true,
        type: Types.ObjectId,
    },
    assigned_to: {
        type: String,
        default: '',
    },
    status: {
        required: true,
        type: String,
        enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
        default: 'NEW',
    },
    state: {
        type: String,
        enum: ['', 'En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery'],
        default: '',
    },
    name: {
        required: true,
        type: String,
    },
    payload: {
        required: true,
        type: Number,
    },
    pickup_address: {
        required: true,
        type: String,
    },
    delivery_address: {
        required: true,
        type: String,
    },
    dimensions: {
        width: {
            required: true,
            type: Number,
        },
        length: {
            required: true,
            type: Number,
        },
        height: {
            required: true,
            type: Number,
        },
    },
    logs: [{message: String, time: {type: Date, default: Date.now}}],
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
},
{versionKey: false},
));
