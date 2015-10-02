var yaml_config = require('node-yaml-config');
var space_config = yaml_config.load('./config/config.yml');
var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');
var _ = require('underscore');


/* API endpoint. */
router.get('/', function (req, res, next) {
    var people_present_list = [];
    var people_present_total = 0;
    var space_status = false;

    async.series([

        // Get all users current connected to the Wifi network.
        function(callback){
            http.get("http://hackerspace.be/pam/macs.php", function (jres) {

                var body = '';
                jres.on('data', function (chunk) {
                    body += chunk;
                });

                jres.on('end', function () {
                    people_present_list = JSON.parse(body);
                    people_present_total = people_present_list.length;
                    callback();
                });
            });
        },

        // Check if xbmc-eleclab is online
        function(callback) {
            if(_.contains(people_present_list, 'xbmc-eleclab')) {
                space_status = true;
                callback();
            }
            else {
                callback();
            }
        },

        // return json
        function(callback) {

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                api: '0.13',
                space: space_config.name,
                logo: space_config.logo,
                url: space_config.url,
                state: {
                    open: space_status
                },
                location: {
                    address: space_config.location.address,
                    lat: space_config.location.lat,
                    lon: space_config.location.lon
                },
                contact: {
                    email: space_config.contact.email,
                    phone: space_config.contact.phone,
                    irc: space_config.contact.irc,
                    twitter: space_config.contact.twitter,
                    facebook: space_config.contact.facebook
                },
                issue_report_channels: space_config.issue_report_channels,
                spacefed: {
                    spacenet: space_config.spacefed.spacenet,
                    spacesaml: space_config.spacefed.spacesaml,
                    spacephone: space_config.spacefed.spacephone
                },
                sensors : {
                    people_now_present: [{
                        value: people_present_total,
                        names: people_present_list,
                        name: 'Wifi network connections',
                        description: 'Hostnames connected to the wifi network. See https://hackerspace.be/pam for a visual representation.',
                    }]
                }
            }));
        }

    ]);
});


module.exports = router;
