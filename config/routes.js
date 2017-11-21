const users = require('../controllers/users'),
      cors = require('cors'),
      auth = require('./auth'),
      passport = require('passport'),
      mongoose = require('mongoose');
      const path = require('path');
      const multer = require('multer');
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads/images')
        },
        filename:(req, file, cb) => {
          cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
      });
      const upload = multer({storage:storage})/* .single("profile-photo") */.array("profilePhoto",12);
      const Jimp = require("jimp"); 
      let jwt = require('jsonwebtoken');
module.exports = (app) => {
    
    app.use(cors());
    
    /* app.get("/",(request, response)=>{
        response.json("running successfully");
    }); */
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
      
    app.post("/upload", function (req, res) {
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
                console.log("file saved Successfully");
                res.send(req.files);
            }else{
                res.send("send the file first");
            }
        });
      });
    
      /* app.post('/upload',(req, res) => {
          upload(req, res, (err)=>{
            if(req.file != null){
            if (err) {
                console.log(err.message);
                res.send("erro saving file");
              }
            //   console.log(req.file.filename);
            //   console.log(req.file.path);
              let smallUrl =req.file.path.slice(0,req.file.path.lastIndexOf("/"))+"/small/"
              +req.file.filename.slice(0,req.file.filename.lastIndexOf('.'))+ "-sm"+path.extname(req.file.filename); 
              
              let mediumUrl =req.file.path.slice(0,req.file.path.lastIndexOf("/"))+"/medium/"
              +req.file.filename.slice(0,req.file.filename.lastIndexOf('.'))+ "-md"+path.extname(req.file.filename); 

              let largeUrl =req.file.path.slice(0,req.file.path.lastIndexOf("/"))+"/large/"
              +req.file.filename.slice(0,req.file.filename.lastIndexOf('.'))+ "-lg"+path.extname(req.file.filename); 
              
            //   console.log(req.file.filename.slice(0,req.file.filename.lastIndexOf('.'))+ "-sm"+path.extname(req.file.filename) )
                Jimp.read(req.file.path,(err, profilePhoto) => {
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
              console.log("file saved Successfully");
              res.redirect('/');
            }else{
                res.send("send the file first");
            }
          })
          /*to be implemented
           let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMGVjNmU4OTEyYWNiN2NkNmU1M2I5MSIsImlhdCI6MTUxMTI1OTA1M30.lsH5lzr270ibkjIFqq6HrrUuhJatEhckPkEQ2Tjswjw";
          let decodedToken = jwt.decode(token,'tasmanianDevil');
          console.log(decodedToken); */
        // }); */
      
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