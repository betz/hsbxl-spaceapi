var yaml_config = require('node-yaml-config');
var space_config = yaml_config.load('./config/config.yml');
var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');
var _ = require('underscore');


/* Home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'HSBXL Space-API'});
});


module.exports = router;
