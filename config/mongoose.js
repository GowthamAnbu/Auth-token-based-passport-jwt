const mongoose = require('mongoose');

    module.exports = (config) => {
        mongoose.connect(config.db, { useMongoClient: true });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error...'));
        db.once('open', () => {
            console.log('multivision db opened');
        });
    };