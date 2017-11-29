let multer = require("multer"),
path = require('path'),
fs = require('fs');
let jwt = require('jsonwebtoken');
let events = require('../controllers/events');
let event;
let mongoose = require('mongoose');
let storage = multer.diskStorage({
 destination: (request, file, callback) => {
    // event = JSON.parse(request.body.event);
    if(request.headers != null){
        var token = request.headers.authorization.split(' ')[1];
        decodedToken = jwt.decode(token,'tasmanianDevil');
        let path = `./public/assets/${request.body.name}/${decodedToken.id}`
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        callback(null, path);
    }
 },
 filename:(request, file, callback) => {
   callback(null,file.originalname /* + path.extname(file.originalname) */);
 }
});
const upload = multer({storage:storage}).fields([{name: 'photos',maxCount: 10}]);

exports.upload = function(request, response,next){
 upload(request, response, function(err){
   if(err){
     return next(err);
   }
   let photos = [];
   request.files.photos.forEach(photo => {
     photos.push(photo.path);
   });
   events.upload(request.body.name,photos);
   response.send(request.files);
 });
}
