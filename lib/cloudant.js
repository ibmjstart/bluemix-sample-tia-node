// Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

var utils = require("./utils");

var COLLECTIONS = {
    kloutInfo:      null,
    twitterInfo:    null,
    tweets:         null
};

var CLOUDANT_URL = 'To run locally, copy-paste your Cloudant VCAP URL here.';

var cloudant = exports;
var nanodb;
var klout;
var twitter;
var tweets;

//------------------------------------------------------------------------------
cloudant.init = function(callback) {
    setCloudantURL();
    log('url: ' + CLOUDANT_URL);

    nanodb = require('nano')(CLOUDANT_URL);
    nanodb.db.create('klout', function() {
      klout = nanodb.use('klout');
    });
    nanodb.db.create('twitter', function() {
      twitter = nanodb.use('twitter');
    });
    nanodb.db.create('tweets', function() {
      tweets = nanodb.use('tweets');
    });

    callback();
};

//------------------------------------------------------------------------------
cloudant.getKloutInfo = function(twitterSN, callback) {
    klout.get(twitterSN, callback);
};

//------------------------------------------------------------------------------
cloudant.putKloutInfo = function(twitterSN, document, callback) {
    klout.insert(document, twitterSN, callback);
};

//------------------------------------------------------------------------------
cloudant.getTwitterInfo = function(twitterSN, callback) {
    twitter.get(twitterSN, callback);
};

//------------------------------------------------------------------------------
cloudant.putTwitterInfo = function(twitterSN, document, callback) {
    twitter.insert(document, twitterSN, callback);
};

//------------------------------------------------------------------------------
cloudant.getTweets = function(twitterSN, callback) {
    tweets.get(twitterSN, callback);
};

//------------------------------------------------------------------------------
cloudant.putTweets = function(twitterSN, document, callback) {
    tweets.insert(document, twitterSN, callback);
};

//------------------------------------------------------------------------------
cloudant.getDocument = function(twitterSN, type, callback) {
    callback = callback || function() {};

    var coll = COLLECTIONS[type];
    if (!coll) {
        callback();
        return;
    }

    var query = {
        tia_twitterSN: twitterSN
    };

    coll.find(query, {limit:1}).toArray(function(err, docs) {
        docs = docs || [];
        callback(err, docs[0]);
    });
};

//------------------------------------------------------------------------------
cloudant.putDocument = function(twitterSN, type, document, callback) {
    callback = callback || function() {};

    var coll = COLLECTIONS[type];
    if (!coll) {
        callback();
        return;
    }

    document.tia_twitterSN  = twitterSN;
    document.tia_created_at = new Date();

    coll.insert([document], {w:1}, callback);
};

//------------------------------------------------------------------------------
function setCloudantURL() {
    try {
        // utils.log("VCAP_SERVICES: " + process.env.VCAP_SERVICES)
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        for (var svcName in vcapServices) {
	        if (svcName.match(/^cloudant.*/)) {
	                CLOUDANT_URL =                 vcapServices[svcName][0].credentials.uri;
	                CLOUDANT_URL = CLOUDANT_URL || vcapServices[svcName][0].credentials.url;
	                break;
	            }
        }

    }
    catch (e) {}
}

//------------------------------------------------------------------------------
function log(message) {
    utils.log("cloudant: " + message);
}

/*-------------------------------------------------------------------*/
/*                                                                   */
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*                                                                   */
/*-------------------------------------------------------------------*/
/*                                                                   */
/*        NOTICE TO USERS OF THE SOURCE CODE EXAMPLES                */
/*                                                                   */
/* The source code examples provided by IBM are only intended to     */
/* assist in the development of a working software program.          */
/*                                                                   */
/* International Business Machines Corporation provides the source   */
/* code examples, both individually and as one or more groups,       */
/* "as is" without warranty of any kind, either expressed or         */
/* implied, including, but not limited to the warranty of            */
/* non-infringement and the implied warranties of merchantability    */
/* and fitness for a particular purpose. The entire risk             */
/* as to the quality and performance of the source code              */
/* examples, both individually and as one or more groups, is with    */
/* you. Should any part of the source code examples prove defective, */
/* you (and not IBM or an authorized dealer) assume the entire cost  */
/* of all necessary servicing, repair or correction.                 */
/*                                                                   */
/* IBM does not warrant that the contents of the source code         */
/* examples, whether individually or as one or more groups, will     */
/* meet your requirements or that the source code examples are       */
/* error-free.                                                       */
/*                                                                   */
/* IBM may make improvements and/or changes in the source code       */
/* examples at any time.                                             */
/*                                                                   */
/* Changes may be made periodically to the information in the        */
/* source code examples; these changes may be reported, for the      */
/* sample code included herein, in new editions of the examples.     */
/*                                                                   */
/* References in the source code examples to IBM products, programs, */
/* or services do not imply that IBM intends to make these           */
/* available in all countries in which IBM operates. Any reference   */
/* to the IBM licensed program in the source code examples is not    */
/* intended to state or imply that IBM's licensed program must be    */
/* used. Any functionally equivalent program may be used.            */
/*-------------------------------------------------------------------*/
