const mongoose = require('mongoose');
module.exports = connectToMongo = () => {
    mongoose.connect(process.env.url_mongodb).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    } );
};