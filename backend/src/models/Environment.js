const mongoose = require('mongoose');

const EnvironmentSchema = new mongoose.Schema({
    nodemcu: {
        type: String, 
        required: true,
    },
    ports: {
        type: [String], 
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    name: {
        type: String, 
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    registered_plants: {
        type: Number,
        required: true,
    },
    ideal_conditions: {
        temperature: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        },
        air_humidity: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        }
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
}, {
    toJSON: {
        virtuals: true,
    },
});

EnvironmentSchema.virtual('thumbnail_url').get(function(){
    return `http://localhost:3333/files/${this.thumbnail}`
});

module.exports = mongoose.model('Environment', EnvironmentSchema);