/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.controller("body-controller", Controller)

//------------------------------------------------------------------------------
function Controller($scope, $http, $window, pageTitleSetter) {
    pageTitleSetter.setBase("TIA - ")

    $scope.version = PackageJSON.version

    $scope.users    = []
    $scope.messages = []

    $scope.addMessage = function (message) {
        var date = new Date()
        var hh   = right2(date.getHours())
        var mm   = right2(date.getMinutes())
        var ss   = right2(date.getSeconds())

        date = hh + ":" + mm + ":" + ss 
        $scope.messages.push(date + " - " + message)
    }

    $scope.clearMessages = function() {
        $scope.messages = []
    }  

    $scope.enableTooltips = function() {
        setTimeout(function(){$("span[title]").tooltip()}, 1000)
    }
}

function right2(s) {
    s = "" + s
    while (s.length < 2) {
        s = "0" + s
    }
    return s
}

})(); // IIFE end
