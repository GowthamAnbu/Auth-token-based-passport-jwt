const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model("user");
encrypt = require('../utilities/encryption');
let jwt = require('jsonwebtoken');

var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

exports.register = (request, response, next) => {
	request.body.email = request.body.email.toLowerCase();
	User.findOne({email: request.body.email}, function(err, user) {
		if(err) {
		  return next(err);
		  }
		if(user) {
		//   console.log('user already exists');
		  response.status(400);
		  response.send({message:"email already exists"});
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
			newUser.password = encrypt.hashpwd(newUser.salt,request.body.password);
			newUser.save(function(err) {
			  if(err) {
				  console.log(err);
				  return next(err);
			  }
			  response.status(201);
			  response.send({message:"user created successfully"});
			});
		  }
	});
};

exports.login = (request, response, next) => {
		request.body.email = request.body.email.toLowerCase(); 

		User.findOne({email:request.body.email},{firstName:1,lastName:1, salt:1, password:1}).exec((err, user) => {
			if(err){return next(err);}
			if(user && user.authenticate(request.body.password)){
				var payload = {id: user._id};
				var token = jwt.sign(payload, jwtOptions.secretOrKey);
				response.send({token:token, firstName:user.firstName, lastName: user.lastName});
			}else{
				response.status(400);
				response.send({message:"username or password is incorrect"});
			}
    	})  
};
/*
exports.authenticate = (request, response, next) => {
		const auth = passport.authenticate('jwt',(err, user) =>{
			console.log("user is :"+user);
			if(err){return next(err);}
			if(!user){
				response.status(400);
				response.send({message: "You are not authenticated to view Secret"});
			}
			else{
			response.send({message: "success you have a token"});
			}
		})
		auth(request, response, next);
};

exports.requiresApiLogin = (request, response, next) => {
	if(!request.isAuthenticated()){
		response.status(403);
		response.end();
	} else{
		next();
	}
};
 */