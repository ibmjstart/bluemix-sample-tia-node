// Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

var _       = require("underscore")
var async   = require("async")
var mongodb = require("mongodb")

var utils = require("./utils")

var LOCAL_MONGODB_URL = "mongodb://localhost:27017/bluemix-sample-tia-node"

var TTL = {
    kloutInfo:      60 * 60 * 4,   //  4 hours
    twitterInfo:    60 * 60 * 1,   //  1 hour
    tweets:         60 * 10        // 10 minutes
}

var COLLECTIONS = {
    kloutInfo:      null,
    twitterInfo:    null,
    tweets:         null
}

var DB
var COLL_KLOUT_INFO
var COLL_TWITTER_INFO
var COLL_TWEETS

var mongo = exports

//------------------------------------------------------------------------------
mongo.init = function(callback) {
    setMongoURL()
    log("url: " + MONGODB_URL)

    async.series([
        initConnection,
        initOpen,
        initCollections
        ],
        callback
    )
}

//------------------------------------------------------------------------------
mongo.getKloutInfo = function(twitterSN, callback) {
    mongo.getDocument(twitterSN, "kloutInfo", callback)
}

//------------------------------------------------------------------------------
mongo.putKloutInfo = function(twitterSN, document, callback) {
    mongo.putDocument(twitterSN, "kloutInfo", document, callback)
}

//------------------------------------------------------------------------------
mongo.getTwitterInfo = function(twitterSN, callback) {
    mongo.getDocument(twitterSN, "twitterInfo", callback)
}

//------------------------------------------------------------------------------
mongo.putTwitterInfo = function(twitterSN, document, callback) {
    mongo.putDocument(twitterSN, "twitterInfo", document, callback)
}

//------------------------------------------------------------------------------
mongo.getTweets = function(twitterSN, callback) {
    mongo.getDocument(twitterSN, "tweets", callback)
}

//------------------------------------------------------------------------------
mongo.putTweets = function(twitterSN, document, callback) {
    mongo.putDocument(twitterSN, "tweets", document, callback)
}

//------------------------------------------------------------------------------
mongo.getDocument = function(twitterSN, type, callback) {
    callback = callback || function() {}

    var coll = COLLECTIONS[type]
    if (!coll) {
        callback()
        return
    }

    var query = {
        tia_twitterSN: twitterSN
    }

    coll.find(query, {limit:1}).toArray(function(err, docs) {
        docs = docs || []
        callback(err, docs[0])
    })
}

//------------------------------------------------------------------------------
mongo.putDocument = function(twitterSN, type, document, callback) {
    callback = callback || function() {}

    var coll = COLLECTIONS[type]
    if (!coll) {
        callback()
        return
    }

    document.tia_twitterSN  = twitterSN
    document.tia_created_at = new Date()

    coll.insert([document], {w:1}, callback)
}

var MONGODB_URL

//------------------------------------------------------------------------------
function setMongoURL() {
    var url = null

    try {
        // utils.log("VCAP_SERVICES: " + process.env.VCAP_SERVICES)
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES)
        for (var svcName in vcapServices) {
            if (svcName.match(/^mongo.*/)) {
                url =        vcapServices[svcName][0].credentials.uri
                url = url || vcapServices[svcName][0].credentials.url
                break;
            }
        }

    }
    catch (e) {}

    MONGODB_URL = url || LOCAL_MONGODB_URL // set the global
}

//------------------------------------------------------------------------------
function init(callback) {
    setMongoURL()
    log("url: " + MONGODB_URL)

    async.series([
        initConnection,
        initOpen,
        initCollections
        ],
        function(err) {callback(err)}
    )
}

//------------------------------------------------------------------------------
function initConnection(callback) {
    utils.log("connecting...")

    mongodb.MongoClient.connect(MONGODB_URL, function(err, db) {
        if (err) {
            utils.log("error connecting; err: " + err)
            callback(err)
            return
        }

        utils.log("connected")

        DB = db // set the global
        callback()
    })
}

//------------------------------------------------------------------------------
function initOpen(callback) {
    callback()
//    utils.log("opening...")
//
//    DB.open(function(err, ignored) {
//        if (err) {
//            utils.log("error opening; err: " + err)
//            callback(err)
//            return
//        }
//
//        utils.log("opened")
//        callback()
//    })
}

//------------------------------------------------------------------------------
function initCollections(callback) {
    var tasks = {}
    for (var name in COLLECTIONS) {
        tasks[name] = initCollection(name)
    }

    async.parallel(tasks, callback)
}

//------------------------------------------------------------------------------
function initCollection(collectionName) {
    return function(callback) {
        DB.collection(collectionName, function(err, collection) {
            if (err) {
                utils.log("error getting collection " + collectionName + "; err: " + err)
                callback(err)
                return
            }

            COLLECTIONS[collectionName] = collection // set global

            initCollectionTTL(callback, collection, collectionName)
        })
    }
}

//------------------------------------------------------------------------------
function initCollectionTTL(callback, collection, collectionName) {
    collection.ensureIndex(
        {tia_created_at:     1},
        {expireAfterSeconds: TTL[collectionName]},
        function(err, ignored) {
            if (err) {
                utils.log("error setting TTL for collection " + collectionName + "; err: " + err)
            }
            callback(err)
        }
    )
}

//------------------------------------------------------------------------------
function log(message) {
    utils.log("mongo: " + message)
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
