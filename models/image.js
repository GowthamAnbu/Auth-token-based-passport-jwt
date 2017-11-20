const mongoose = require("mongoose");

let imageSchema = new mongoose.Schema(
    { img: 
        { data: Buffer, contentType: String }
    }
  );

let Image = mongoose.model('image',imageSchema);
module.exports = Image;
  