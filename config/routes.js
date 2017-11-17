const users = require('../controllers/users'),
      cors = require('cors'),
      auth = require('./auth'),
      passport = require('passport');

module.exports = (app) => {
    
    app.use(cors());
    
    /* app.get("/",(request, response)=>{
        response.json("running successfully");
    }); */

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