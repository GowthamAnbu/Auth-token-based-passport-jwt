const express = require('express'),
    logger = require('morgan'),
    bodyparser = require('body-parser'),
    passport = require('passport');

module.exports = (app, config) => {

    app.use(logger('dev'));

    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());

    app.use(passport.initialize());

    app.use(express.static(config.rootPath + '/public'));
}