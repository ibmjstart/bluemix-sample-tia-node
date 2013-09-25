// Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

var path    = require("path")
var async   = require("async")
var express = require("express")

var pkg      = require("../package.json")
var utils    = require("./utils")
var klout    = require("./klout")
var twitter  = require("./twitter")
var api      = require("./api")

var WWWDIR = path.join(__dirname, "../www")
var VENDOR = path.join(__dirname, "../vendor")

var server = exports

server.run = run

//------------------------------------------------------------------------------
function run(config) {
    var key
    var secret

    //---------------------------------
    try {
        key = config.klout.developer_key
        if (!key) throw null
    }
    catch(e) {
        utils.log("klout key not set")
        process.exit(1)
    }


    klout.setKey(key)

    //---------------------------------
    try {
        key    = config.twitter.consumer_key
        secret = config.twitter.consumer_secret

        if (!key) throw null
        if (!secret) throw null
    }
    catch(e) {
        utils.log("twitter key not set")
        process.exit(1)
    }

    twitter.init(key, secret, function(err) {
        run2(err, config)
    })
}

//------------------------------------------------------------------------------
function run2(err, config) {
    if (err) {
        utils.log("error getting twitter token: " + err.message)
        process.exit(1)
    }

    var favIcon = path.join(WWWDIR, "images/icon-032.png")

    var app  = express()
    app.use(express.favicon(favIcon))
    app.use("/",       express.static(WWWDIR))
    app.use("/scripts/package.json.js", handlePackageJSON)
    app.use("/api/v1", api())

    utils.log("starting server on pid " + process.pid + " at http://localhost:" + utils.JL(config.port))
    app.listen(config.port)
}

//------------------------------------------------------------------------------
function handlePackageJSON(request, response) {
    var output = "PackageJSON = " + utils.JL(pkg) + ";"

    response.header("Content-Type", "application/javascript")
    response.send(output)
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
