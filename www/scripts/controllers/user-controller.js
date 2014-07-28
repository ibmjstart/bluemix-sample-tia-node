/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.controller("user-controller", Controller)

//------------------------------------------------------------------------------
function Controller($scope, $http, $routeParams, pageTitleSetter, users) {
    pageTitleSetter.setTitle("user " + $routeParams.twitterSN)

    $scope.user         = {}
    $scope.users        = users
    $scope.twitterSN    = $routeParams.twitterSN
    $scope.score        = "??"
    $scope.profileImage = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="

    $scope.user.twitterSN = $scope.twitterSN

    Tia.loadUserControllerCache($scope)

    //---------------------------------
    var http = $http.get("/api/v1/users/" + $scope.twitterSN + "/klout-info.json")

    http.success( 
        function(data) {gotUser($scope, data)}
    )

    http.error(   
        function(data, status) {gotUserError($scope, status)}
    )

    //---------------------------------
    http = $http.get("/api/v1/users/" + $scope.twitterSN + "/tweets.json")

    http.success( 
        function(data) {gotTweets($scope, data)}
    )

    http.error(   
        function(data, status) {gotTweetsError($scope, status)}
    )

    //---------------------------------
    http = $http.get("/api/v1/users/" + $scope.twitterSN + "/twitter-info.json")

    http.success( 
        function(data) {gotTwitterInfo($scope, data)}
    )

    http.error(   
        function(data, status) {gotTwitterInfoError($scope, status)}
    )

    $scope.$evalAsync("enableTooltips()")
}

//------------------------------------------------------------------------------
function gotUser($scope, data) {
    if (!data.data) {
        gotUserError($scope, "<unknown>")
        return
    }

    //$scope.dump = JSON.stringify(data, null, 4)
    $scope.score = Math.round(data.data.score.score)
    $scope.user.score = $scope.score

    $scope.users.updateUser($scope.user)
    Tia.saveUserControllerCache($scope)

    $scope.influencedBy = []
    for (var i=0; i<data.data.influence.myInfluencers.length; i++) {
        var user = data.data.influence.myInfluencers[i]
        $scope.influencedBy.push({
            score:      Math.round(user.entity.payload.score.score),
            twitterSN:  user.entity.payload.nick
        })
    }

    $scope.influences = []
    for (var i=0; i<data.data.influence.myInfluencees.length; i++) {
        var user = data.data.influence.myInfluencees[i]
        $scope.influences.push({
            score:      Math.round(user.entity.payload.score.score),
            twitterSN:  user.entity.payload.nick
        })
    }

    $scope.influencedByEmpty = (0 == $scope.influencedBy.length)
    $scope.influencesEmpty   = (0 == $scope.influences.length)

    $scope.$evalAsync("enableTooltips()")
}

//------------------------------------------------------------------------------
function gotUserError($scope, status) {
    $scope.addMessage("error " + status + " accessing klout data for " + $scope.twitterSN)

    $scope.influencedByEmpty = true
    $scope.influencesEmpty   = true
}

//------------------------------------------------------------------------------
function gotTweets($scope, data) {
    $scope.tweets = []
    $scope.geos   = []

    for (var i=0; i<data.data.tweets.length; i++) {
        var tweet    = data.data.tweets[i]
        var geoIndex = null

        var mapURL = "https://maps.google.com/?q="

        if (tweet.geo) {
            $scope.geos.push(tweet.geo.coordinates)
            geoIndex = $scope.geos.length

            mapURL += tweet.geo.coordinates[0] 
            mapURL += ","
            mapURL += tweet.geo.coordinates[1] 
        }

        $scope.tweets.push({
            id:         tweet.id_str,
            date:       tweet.created_at,
            text:       tweet.text,
            geoIndex:   geoIndex,
            mapURL:     mapURL
        })
    }

    if (!$scope.geos.length) {
        return
    }

    var mapURLbits = []
    mapURLbits.push("http://maps.googleapis.com/maps/api/staticmap?sensor=false")
//    mapURLbits.push("center=0,0")
//    mapURLbits.push("zoom=0")
    mapURLbits.push("size=640x640")
    mapURLbits.push("visual_refresh=true")

    for (var i=0; i<$scope.geos.length; i++) {
        var markerBits = []

        markerBits.push("size:mid")
        markerBits.push("color:red")
        markerBits.push("label:" + (i+1))
        markerBits.push($scope.geos[i][0] + "," + $scope.geos[i][1])

        mapURLbits.push("markers=" + markerBits.join("%7C"))
    }

    $scope.mapURL = mapURLbits.join("&")
    
    $scope.$evalAsync("enableTooltips()")
}

//------------------------------------------------------------------------------
function gotTweetsError($scope, status) {
    $scope.addMessage("error " + status + " accessing tweets for " + $scope.twitterSN)
}

//------------------------------------------------------------------------------
function gotTwitterInfo($scope, data) {
    data = data.data
    if (location.protocol == "http:") {
        $scope.profileImage = data.profile_image_url
    }
    else {
        $scope.profileImage = data.profile_image_url_https
    }

    $scope.user.profileImage = $scope.profileImage

    $scope.users.updateUser($scope.user)
    Tia.saveUserControllerCache($scope)

    $scope.userLocation = data.location

    $scope.$evalAsync("enableTooltips()")
}

//------------------------------------------------------------------------------
function gotTwitterInfoError($scope, status) {
    $scope.addMessage("error " + status + " accessing twitter info for " + $scope.twitterSN)
}

})(); // IIFE end
