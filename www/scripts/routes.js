/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

var home = "/all"
var routes = {
    "/user/:twitterSN": "user",
    "/all":             "all",   
    "/help":            "help",   
    "/messages":        "messages"
}

//------------------------------------------------------------------------------
TiaModule.config(routeProvider)

//------------------------------------------------------------------------------
function routeProvider($routeProvider) {
    for (var key in routes) {
        var val = routes[key]
        $routeProvider.when(key, {
            templateUrl:    "scripts/controllers/" + val + ".html",   
            controller:     val + "-controller"
        })
    }
    
    $routeProvider.otherwise({redirectTo: home})
}

})(); // IIFE end
