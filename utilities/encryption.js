var crypto = require('crypto');

//basic salt creation for hashing
exports.createsalt = () => {
	return crypto.randomBytes(128).toString('base64');
}

//basic algorithm for hashing
exports.hashpwd = (salt, pwd) => {
	var hmac = crypto.createHmac('sha1', salt);
	hmac.setEncoding('hex');
	hmac.write(pwd);
	hmac.end();
	return hmac.read();
}