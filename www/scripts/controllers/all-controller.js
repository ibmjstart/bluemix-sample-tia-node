/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.controller("all-controller", Controller)

//------------------------------------------------------------------------------
function Controller($scope, $location, pageTitleSetter, users) {
    // $scope.addMessage("creating an all-controller")

    pageTitleSetter.setTitle("home")

    $scope.users = users.getUsers()

    $scope.showUser = function() {
        $location.path("/user/" + $scope.twitterSN)
    }

    $scope.removeUser = function(twitterSN) {
        users.removeUser(twitterSN)
        $scope.users = users.getUsers()
    }

    $scope.twitterSN             = ""
    $scope.analyzeButtonDisabled = true

    $scope.$watch("twitterSN", function(nVal, oVal){
        $scope.analyzeButtonDisabled = (nVal == "")
    })

    $scope.$evalAsync("enableTooltips()")
}

})(); // IIFE end

