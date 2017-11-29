const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let eventSchema = new Schema({
    name : String,
    img_url: String,
    date: {type: Date, default:Date.now},
    location: {
        doorNo: Number,
        area: String,
        pincode: Number
    },
    photos: {type: [String]}
});

let event = module.exports = mongoose.model('event',eventSchema);