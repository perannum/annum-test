/* jshint node: true */
(function() {
    "use strict";

    var async = require('async'),
        Browser = require('zombie'),
        url = require('../lib/urlformatter'),
        Q = require('q');

    Browser.runScripts = false;

    module.exports = {

        i_want_title: function(req, res, next) {

            // If Query parameter doesn't exists.
            if (!req.query.address) {
                return next();
            }

            // Functions to be processed by async.parallel
            var callTo = [];

            // Lets take a look over address format.
            if (Array.isArray(req.query.address)) {
                // Iterate each address and make it for request.
                [].concat(req.query.address).forEach(function(address) {
                    callTo.push(function asyncCallee(callback) {
                        pageScrapper(address)
                            .then(function scrapperSuccess(title) {
                                return callback(null, title);
                            }, function scrapperError(title) {
                                // Do something with error here.
                                return callback(null, title);
                            });
                    });
                });

            } else {
                // Just single address to hit.
                callTo.push(function asyncCallee(callback) {
                    pageScrapper(req.query.address)
                        .then(function scrapperSuccess(title) {
                            return callback(null, title);
                        }, function scrapperError(title) {
                            // Do something with error here.
                            return callback(null, title);
                        });
                });
            }

            async.parallel(callTo, function(err, results) {
                if (err) {
                    // Do something with error..
                }

                res.render('page.html',{
                    title: results
                });
            });

            // For now, just raw function defined.
            function pageScrapper(address) {

                var _uri = url.format(address),
                    deferred = Q.defer();

                if (url.isValid(_uri) === false) {
                    deferred.reject(address + " - NO RESPONSE");
                } else {
                    Browser.visit(_uri, function(e, browser) {
                        if (e) {
                            deferred.reject(e);
                        }
                        var title = browser.text("title") || "NO RESPONSE";
                        deferred.resolve(address + " - "+ title);
                    });
                }
                return deferred.promise;
            }
        }
    };
})();
