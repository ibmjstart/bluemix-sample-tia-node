// Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

var express = require("express")

var pkg      = require("../package.json")
var utils    = require("./utils")
var klout    = require("./klout")
var twitter  = require("./twitter")
var mongo    = require("./mongo")

//------------------------------------------------------------------------------
// the APIs supported in this express sub-application all follow a similar flow:
//
// * extract twitter screen name from URL
// * look up data requested in mongodb cache; if found return it
// * look up data from the actual web service; if found, cache it and return it
//------------------------------------------------------------------------------

module.exports = function() {
    var app = express()

    app.use(CORSify)

    app.get("/users/:twitterSN/klout-info.json",   GetKloutInfo)
    app.get("/users/:twitterSN/tweets.json",       GetTweets)
    app.get("/users/:twitterSN/twitter-info.json", GetTwitterInfo)

    return app
}

//------------------------------------------------------------------------------
function GetKloutInfo(request, response) {
    var twitterSN = request.params.twitterSN

    mongo.getKloutInfo(twitterSN, function(err, data){
        if (data) {
            return sendResponseOK(response, data)
        }

        klout.getKloutInfo(twitterSN, function(err, data){
            if (err) return sendResponseError(response, err)

            sendResponseOK(response, data)
            mongo.putKloutInfo(twitterSN, data)
        })
    })
}

//------------------------------------------------------------------------------
function GetTweets(request, response) {
    var twitterSN = request.params.twitterSN

    mongo.getTweets(twitterSN, function(err, data){
        if (data) {
            return sendResponseOK(response, data)
        }

        twitter.getTweets(twitterSN, function(err, data){
            if (err) return sendResponseError(response, err)

            sendResponseOK(response, data)
            mongo.putTweets(twitterSN, data)
        })
    })

}

//------------------------------------------------------------------------------
function GetTwitterInfo(request, response) {
    var twitterSN = request.params.twitterSN

    mongo.getTwitterInfo(twitterSN, function(err, data){
        if (data) {
            return sendResponseOK(response, data)
        }

        twitter.getTwitterInfo(twitterSN, function(err, data){
            if (err) return sendResponseError(response, err)
    
            sendResponseOK(response, data)
            mongo.putTwitterInfo(twitterSN, data)
        })
    })
}

//------------------------------------------------------------------------------
function sendResponseOK(response, data) {
    sendResponse(response, 200, {data: data})
}

//------------------------------------------------------------------------------
function sendResponseError(response, err) {
    sendResponse(response, err.statusCode, "" + err.message)
}

//------------------------------------------------------------------------------
function sendResponse(response, status, data) {
    if (data == null) data = ""

    response.statusCode = status;
    response.send(data)
}

//------------------------------------------------------------------------------
function CORSify(request, response, next) {
    response.header("Access-Control-Allow-Origin:", "*")
    response.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
    next()
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
