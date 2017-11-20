const users = require('../controllers/users'),
      cors = require('cors'),
      auth = require('./auth'),
      passport = require('passport'),
      mongoose = require('mongoose');
      const multer = require('multer');
      const upload = multer({
        dest: 'uploads/' // this saves your file into a directory called "uploads"
      }); 
module.exports = (app) => {
    
    app.use(cors());
    
    /* app.get("/",(request, response)=>{
        response.json("running successfully");
    }); */
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
      });
      
      // It's very crucial that the file name matches the name attribute in your html
      app.post('/', upload.single('file-to-upload'), (req, res) => {
        res.redirect('/');
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