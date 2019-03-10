const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    stepNo: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Step = mongoose.model('Step', stepSchema);
module.exports = Step;