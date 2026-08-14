const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Owner', ownerSchema);