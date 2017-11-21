const users = require('../controllers/users'),
      cors = require('cors'),
      auth = require('./auth'),
      passport = require('passport'),
      mongoose = require('mongoose');
      const path = require('path');
      const multer = require('multer');
      let storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads/images')
        },
        filename: function (req, file, cb) {
          cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
      });
      const upload = multer({storage:storage}).single("profile-photo");
      const Jimp = require("jimp"); 
module.exports = (app) => {
    
    app.use(cors());
    
    /* app.get("/",(request, response)=>{
        response.json("running successfully");
    }); */
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
      });
      
      // It's very crucial that the file name matches the name attribute in your html
      app.post('/',(req, res) => {
          upload(req, res, (err)=>{
            if (err) {
                console.log(err.message);
                res.send("erro saving file");
              }
              console.log(req.file);
              console.log("fine");
              res.redirect('/');
          })
          /* console.log(req.file.path);
          console.log(req.file.originalname);
          console.log(req.file.originalname.lastIndexOf('.'));
          console.log(req.file.originalname.slice(req.file.originalname.lastIndexOf('.'))); */
          
          /* Jimp.read("./images/techaffinity-squarelogo-1466416896536.png", function (err, squarelogo) {
            if (err) throw err;
            squarelogo.resize(256, 256)            // resize 
                 .quality(100)                 // set JPEG quality 
                 .write("./images/small/techaffinity-squarelogo-1466416896536-sm.png",function(err,squarelogo){
                     if(err) throw err;
                     console.log("file successfully written");
                 }); // save 
                 console.log("success");
            }); */
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