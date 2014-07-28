/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

var ucKey    = "tia.cache.userController"
var usersKey = "tia.cache.users"

//------------------------------------------------------------------------------
Tia.loadUserControllerCache = function($scope) {
    var key = ucKey + "." + $scope.twitterSN
    loadScope($scope, key, "score")
    loadScope($scope, key, "profileImage")
}

//------------------------------------------------------------------------------
Tia.saveUserControllerCache = function($scope) {
    var key = ucKey + "." + $scope.twitterSN
    saveScope($scope, key, "score")
    saveScope($scope, key, "profileImage")
}

//------------------------------------------------------------------------------
function loadScope($scope, keyPrefix, key) {
    var val = localStorage.getItem(keyPrefix + "." + key)
    if (val == null) return

    $scope[key] = val
}

//------------------------------------------------------------------------------
function saveScope($scope, keyPrefix, key) {
    if ($scope[key] == null) return

    localStorage.setItem(keyPrefix + "." + key, $scope[key])
}

})(); // IIFE end

