const mongoose = require('mongoose');

const SpecieSchema = new mongoose.Schema({

    uri_image: {
        type: String,
        required: true,
    },

    scientific_name: {
        type: String,
        required: true,
    },
    popular_name: {
        type: String,
        required: true, 
    },
    family: {
        type: String,
        required: true, 
    },
    category: {
        type: String,
        required: true, 
    },
    origin: {
        type: String,
        required: true, 
    },
    height: {
        type: String,
        required: true, 
    },
    climate: {
        type: String,
        required: true, 
    },
    cycle: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
    ideal_conditions: {
        light: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        },
        soil_moisture: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Specie', SpecieSchema);