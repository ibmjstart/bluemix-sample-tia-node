/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.factory("users", serviceFactory)

//------------------------------------------------------------------------------
function serviceFactory() {
    var service  = {}
    var usersMap = {}

    var val = localStorage.getItem("tia.users")
    if (val == null) val = "{}"

    usersMap = JSON.parse(val)

    //--------------------------------------------------------------------------
    service.getUsers = function() {
        var result = []
        for (var key in usersMap) {
            val = usersMap[key]
            result.push(val)
        }

        result.sort(function(u1,u2) {return u2.lastUpdated - u1.lastUpdated})

        return result
    }

    //--------------------------------------------------------------------------
    service.removeUser = function(twitterSN) {
        delete usersMap[twitterSN]
        localStorage.setItem("tia.users", JSON.stringify(usersMap))
    }

    //--------------------------------------------------------------------------
    service.updateUser = function(user) {
        var time = new Date().getTime()
        user.lastUpdated = time

        usersMap[user.twitterSN] = user

        localStorage.setItem("tia.users", JSON.stringify(usersMap))
    }

    return service
}


})(); // IIFE end

