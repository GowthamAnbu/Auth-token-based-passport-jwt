let multer = require("multer"),
 path = require('path'),
 fs = require('fs');
let event;
let storage = multer.diskStorage({
  destination: (request, file, callback) => {
    event = JSON.parse(request.body.event);
        let path = `./public/assets/${event.name}`
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        callback(null, path);
  },
  filename:(request, file, callback) => {
    callback(null,event.name + path.extname(file.originalname));
  }
});
const upload = multer({storage:storage}).fields([{name: 'img',maxCount: 1}]);

exports.create = function(request, response,next){
  upload(request, response, function(err){
    if(err){
      return next(err);
    }
      response.send(request.files);
  });
}
