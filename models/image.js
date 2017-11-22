const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let imageSchema = new Schema({
    photos: {type: [String], required: true},
    user_id:{type: Schema.Types.ObjectId}
});

let image= module.exports = mongoose.model('image',imageSchema);
