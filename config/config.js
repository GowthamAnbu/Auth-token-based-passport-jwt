const path = require('path');
const rootPath = path.normalize(__dirname +'/../');

module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://localhost/angular-initial-template',
		port: process.env.PORT || 3030
	}
}