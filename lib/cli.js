// Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

var utils  = require("./utils")
var server = require("./server")
var mongo  = require("./mongo")

var cli = exports

var PORT = parseInt(process.env.VCAP_APP_PORT || process.env.PORT || "8000", 10)

if (isNaN(PORT)) {
    utils.log("invalid port from environment: " + process.env.PORT)
    process.exit(1)
}

cli.run = run

//------------------------------------------------------------------------------
if (require.main == module) {
    cli.run()
}

//------------------------------------------------------------------------------
function run(args) {

    mongo.init(function(err) {
        if (err) {
            utils.log("error initializing mongodb: " + err)
            process.exit(1)
        }

        run2(args)
    })
}

//------------------------------------------------------------------------------
function run2(args) {
    if (!args) {
        args = process.argv.slice(2)
    }

    var config = getConfig()
    config.port     = PORT

    utils.log("---------------------------------------------------------------")
    server.run(config)

    try {
        process.on("SIGTERM", function() {
            utils.log("stopping server on pid " + process.pid)
            process.exit(0)
        })
    }
    catch(e) {}
}

//------------------------------------------------------------------------------
function getConfig() {
    try {
        return require("../config.json")
    }
    catch (e) {
        utils.log("unable to read config.json file: " + e)
        process.exit(1)
    }
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
