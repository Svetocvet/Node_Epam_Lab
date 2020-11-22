const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    role: {
        type: String,
        required: true,
        enum: ['SHIPPER', 'DRIVER'],
    },
    imageUrl: {
        type: String,
        required: true,
        default: `https://www.netclipart.com/pp/m/411-4114765_avatar-icon.png`,
    },
},
{versionKey: false},
));
