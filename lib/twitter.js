// Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

var URL   = require("url")
var https = require("https")

var utils = require("./utils")

var TwitterURL = "https://api.twitter.com"

var twitter = exports

var BearerToken

//------------------------------------------------------------------------------
twitter.init = function(key, secret, callback) {
    var creds

    creds = key + ":" + secret
    creds = new Buffer(creds).toString("base64")

    url = TwitterURL + "/oauth2/token"
    options = URL.parse(url)
    options.method = "POST"
    options.headers = {
        "Content-Type":  "application/x-www-form-urlencoded;charset=UTF-8",
        "Authorization": "Basic " + creds
    }

    data = "grant_type=client_credentials"
    httpsRequest(options, data, function(err, data) {
        if (!err) {
            BearerToken = data.access_token
            utils.log("twitter bearer token retrieved")
        }

        callback(err, data)
    })
}

//------------------------------------------------------------------------------
twitter.getTweets = function(twitterSN, callback) {
    url = TwitterURL + "/1.1/statuses/user_timeline.json"
    url += "?screen_name=" + twitterSN
    url += "&count=20"
    url += "&trim_user=true"
    url += "&exclude_replies=true"
    url += "&econtributor_details=false"
    url += "&include_rts=false"

    options = URL.parse(url)
    httpsAuthRequest(options, function (err, data) {
        if (err) return callback(err)

        callback(null, {tweets: data})
    })
}

//------------------------------------------------------------------------------
twitter.getTwitterInfo = function(twitterSN, callback) {
    url = TwitterURL + "/1.1/users/show.json"
    url += "?screen_name=" + twitterSN
    url += "&include_entities=false"

    options = URL.parse(url)
    httpsAuthRequest(options, callback)
}

//------------------------------------------------------------------------------
function httpsAuthRequest(options, data, callback) {
    if (!options.headers) {
        options.headers = {}
    }
    options.headers.Authorization = "Bearer " + BearerToken

    httpsRequest(options, data, callback)
}

//------------------------------------------------------------------------------
function httpsRequest(options, data, callback) {
    if (callback === undefined) {
        callback = data
        data     = undefined
    }

    callback = utils.onlyCallOnce(callback)

    if (!options.method) options.method = "GET"

    // utils.log("httpRequest(" + url + ")")
    var request = https.request(options, function(response) {
        handleHttpsResponse(response, callback)
    })
    
    request.on("error", function(err) {
        callback({statusCode: 500, message: err})
    })

    if (data != null) {
        request.write(data)
    }

    request.end()
}

//------------------------------------------------------------------------------
function handleHttpsResponse(response, callback) {
    response.setEncoding("utf8")

    var body = ""

    response.on("data", function (chunk) {
        body += chunk
    })

    response.on("end", function (chunk) {
        if (chunk) {
            body += chunk
        }

        if (response.statusCode != 200) {
            callback({statusCode: response.statusCode, message: body})
            return
        }

        if (body == "") {
            callback(null, "")
            return
        }

        try {
            body = JSON.parse(body)
        }
        catch (err) {
            callback({statusCode: 500, message: err})
            return
        }

        callback(null, body)
    })
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
