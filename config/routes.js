const users = require('../controllers/users'),
      cors = require('cors'),
      auth = require('./auth'),
      passport = require('passport'),
      mongoose = require('mongoose');
      const path = require('path');
      const multer = require('multer');
      const fs = require('fs');
      let decodedToken;
      const Image = require('../models/image');
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if(req.headers != null){
                var token = req.headers.authorization.split(' ')[1];
                decodedToken = jwt.decode(token,'tasmanianDevil');
                let path = `./public/assets/${decodedToken.id}`
                if(!fs.existsSync(path)){
                    fs.mkdirSync(path);
                }
                cb(null, path);
              }
        },
        filename:(req, file, cb) => {
          cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
      });
      const upload = multer({storage:storage})/* .single("profile-photo") */.array("profilePhoto",12);
      const Jimp = require("jimp"); 
      let jwt = require('jsonwebtoken');
      let token = "";
      let events = require('../controllers/events')
module.exports = (app) => {
    
    app.use(cors());
    /* app.get("/",(request, response)=>{
        response.json("running successfully");
    }); */
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
    
    app.post('/saveEvent',events.create);
    app.get('/events',events.get);
    app.get('/events/:id',events.getById);
    app.post('/multiupload',passport.authenticate('jwt', { session: false }), function (req, res) {
        upload(req, res, function(err){
            console.log(req.files);
            res.send(req.files);
        })
    })

    app.post("/upload", passport.authenticate('jwt', { session: false }), function (req, res) {
        upload(req, res, function(err){
            if(req.files != null){
            if (err) {
                console.log(err.message);
                res.send("erro saving file");
            }
           // console.log('files are', req.files);
                let smallUrl =req.files[0].path.slice(0,req.files[0].path.lastIndexOf("/"))+"/small/"
                +req.files[0].filename.slice(0,req.files[0].filename.lastIndexOf('.'))+ "-sm"+path.extname(req.files[0].filename); 
                
                let mediumUrl =req.files[0].path.slice(0,req.files[0].path.lastIndexOf("/"))+"/medium/"
                +req.files[0].filename.slice(0,req.files[0].filename.lastIndexOf('.'))+ "-md"+path.extname(req.files[0].filename); 

                let largeUrl =req.files[0].path.slice(0,req.files[0].path.lastIndexOf("/"))+"/large/"
                +req.files[0].filename.slice(0,req.files[0].filename.lastIndexOf('.'))+ "-lg"+path.extname(req.files[0].filename); 
                
                Jimp.read(req.files[0].path,(err, profilePhoto) => {
                    if (err) throw err;
                    profilePhoto.resize(100, 75)
                        .quality(100)
                        .write(smallUrl,(err,profilePhoto) => {
                            if(err) throw err;
                            console.log("resized 100*75");
                        });
                    profilePhoto.resize(460, 320)
                        .quality(100)
                        .write(mediumUrl,(err,profilePhoto) => {
                            if(err) throw err;
                            console.log("resized 460*320");
                        });
                    profilePhoto.resize(520, 500)
                        .quality(100)
                        .write(largeUrl,(err,profilePhoto) => {
                            if(err) throw err;
                            console.log("resized 520*500");
                        });
                });
                let photoPath =req.files[0].path; 
                let newImage = new Image({
                    photos:photoPath,
                    user_id:mongoose.Types.ObjectId(decodedToken.id),
                });
                console.log(newImage);
                Image.findOne({user_id:newImage.user_id}).exec(function(err, image){
                    if(err){
                        console.log(err);
                        return next(err);
                    }
                    if(!image){
                        newImage.save(function(err) {
                            if(err) {
                                console.log(err);
                                return next(err);
                            }
                            console.log("image created successfully");
                        });
                    }else{
                        Image.findOneAndUpdate({user_id:newImage.user_id},{$push:{photos:newImage.photos}},function(err,image){
                            if(err){
                                console.log(err);
                                return next(err);
                            }if(!image){
                                console.log("no image found");
                            }else{
                                console.log("image updated successfully");
                            }
                        });
                    }
                });
                
                console.log("file saved Successfully");
                res.send(req.files);
            }else{
                res.status(400);
                res.send("send the file first");
            }
        });
      });
    
    app.post("/register",auth.register);
    app.post("/login", auth.login);

    app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
        res.json({message: "Success! You can not see this without a token"});
    });

    app.get('*', (request, response) => {
        response.status(404);
        response.end();
    })
}