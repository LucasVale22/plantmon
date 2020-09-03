const mongoose = require('mongoose');
const Sensor = require('mongoose');

const NodeMCUSchema = new mongoose.Schema({
    device: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    connected: {
        type: Boolean,
        required: true,
    },
    available_ports: {
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('NodeMCU', NodeMCUSchema);