const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = mongoose.Types;
module.exports = mongoose.model('truck', new Schema({
    created_by: {
        required: true,
        type: Types.ObjectId,
    },
    assigned_to: {
        type: String,
        default: '',
    },
    type: {
        required: true,
        type: String,
        enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
    },
    status: {
        type: String,
        default: '',
        enum: ['', 'OL', 'IS'],
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
},
{versionKey: false},
));
