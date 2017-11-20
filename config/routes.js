const users = require('../controllers/users'),
      cors = require('cors'),
      auth = require('./auth'),
      passport = require('passport'),
      mongoose = require('mongoose');

      var fs = require('fs');
      var multer = require('multer');
      var Image = require('../models/image');
module.exports = (app) => {
    
    app.use(cors());
    
    /* app.get("/",(request, response)=>{
        response.json("running successfully");
    }); */

    app.post("/register",auth.register);
    app.post("/login", auth.login);

    

   /*  app.use(multer({ dest: './assets/uploads/profilePhoto',
        rename: function (fieldname, filename) {
        return filename;
        }
    }).single('photo')); */

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
      }
    })
 
var upload = multer({ storage: storage });    
   
    app.post('/api/photo', passport.authenticate('jwt', { session: false }), upload.single('photo'),function(request,response){
        var newItem = new Image();
        console.log(request.file);
        if(request.file != null){
            newItem.img.data = fs.readFileSync(request.file.path);
            newItem.img.contentType = 'image/png';
            newItem.save(function(err){
                if(err){
                    console.log("saving errror");
                    response.send("saving error");
                }
                console.log("success");
                response.send("success");
            });
        }
        else{
            response.send("upload the file first");
        }
    });

    app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
        res.json({message: "Success! You can not see this without a token"});
    });

    app.get('*', (request, response) => {
        response.status(404);
        response.end();
    })
}