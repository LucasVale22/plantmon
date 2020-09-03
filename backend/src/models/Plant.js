const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    ports: {
        type: [String],
        required: true,
    },
    environment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Environment'
    },
    specie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Specie',
    },
    thumbnail: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
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

PlantSchema.virtual('thumbnail_url').get(function(){
    return `http://localhost:3333/files/${this.thumbnail}`
});

module.exports = mongoose.model('Plant', PlantSchema);