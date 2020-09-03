const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
    nodemcu: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    port: {
        type: String,
        required: true,
    },
    connected: {
        type: Boolean,
        required: true,
    },
    data: {
        type: [Number],
        required: true,
    },
    time: {
        type: [Date],
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Sensor', SensorSchema);