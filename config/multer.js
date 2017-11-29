let multer = require("multer");

let storage = multer.diskStorage({
  destination: (request, file, callback) => {
      // if(request.headers != null && request.body !=null){
          let path = `./public/assets/`
          if(!fs.existsSync(path)){
              fs.mkdirSync(path);
          }
          callback(null, path);
        // }
  },
  filename:(request, file, callback) => {
    callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({storage:storage}).fields([{name: 'img',maxCount: 1}]);

exports.create = function(request, response, next){
  upload(request, response, function(err){
    if(err){
      next(err);
    }
    console.log('files are ', request.files);
    console.log("event is ", request.body);
  });
  response.status(201);
  response.send(request.body);
};
