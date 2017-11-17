const mongoose = require('mongoose'),
      passport = require('passport'),
      encrypt = require('../utilities/encryption')/* ,
      LocalStrategy = require('passport-local').Strategy */;

const User = mongoose.model("user");

var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

      
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

module.exports = function(){
    var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        // console.log('payload received', jwt_payload);
        User.findOne({_id: jwt_payload.id},).exec((err, user) => {
          if (user) {
            next(null, user);
          } else {
            next(null, false);
          }
        });
      });
      
      passport.use(strategy);
/* passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},

function(request, email, password, done) {
  process.nextTick(function() {
    User.findOne({email: email}, function(err, user) {
      if(err) {
        return done(err);
        }
      if(user) {
        // console.log('user already exists');
        return done(null, false, {errMsg: 'email already exists'});
      }
      else {
            let newUser = new User({
            firstName:request.body.firstName,
            lastName:request.body.lastName,
            dob:request.body.dob,
            role:request.body.role,
            email:request.body.email,
            mobile:request.body.mobile,
            address:request.body.address,
            is_superuser:request.body.is_superuser,
            is_active:request.body.is_active
          });
          newUser.salt = encrypt.createsalt(); 
          newUser.password = encrypt.hashpwd(newUser.salt,password);
          newUser.save(function(err) {
            if(err) {
                console.log(err);
                return done(null, false);
            }
            return done(null, newUser);
          });
        }
    });
  });
}));

passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
},
(req, email, password, done) => {
    process.nextTick(function(){
    User.findOne({email:email},{firstName:1,lastName:1, salt:1, password:1}).exec((err, user) => {
        if(err){return done(err);}
        if(user && user.authenticate(password)){
            return done(null, user);
        }else{
            return done(null, false,{message:"username or password is incorrect"});
        }
    })        
});
}
));
*/
/* 
passport.serializeUser((user, done) => {
if(user){
    done(null, user._id);
}
})

passport.deserializeUser((_id, done) => {
User.findOne({_id:_id}).exec((err, user) => {
    if(user){
        return done(null, user);
    }else{
        return done(null, false);
    }
})
}) */


}