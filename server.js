var express = require('express');
//global environment variable
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
//including the config data which matches our environment by [env]
var config = require('./config/config')[env];

require('./config/express')(app, config);
require('./config/mongoose')(config);
require('./config/routes')(app);
require('./config/passport')();

app.listen(config.port,(err) => {
    if (err) throw err;
    console.log("listening to the port :" + config.port);
});