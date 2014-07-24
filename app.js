var express = require('express');
var harp = require('harp')
var port = process.env.PORT || 8080;
var router = require('./app/send');

router(express, harp, port);
console.log('Server listening at http://localhost:' + port);
