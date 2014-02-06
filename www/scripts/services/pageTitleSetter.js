/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.factory("pageTitleSetter", pageTitleSetter)

//------------------------------------------------------------------------------
function pageTitleSetter($window) {
    var service = {}

    service.setBase = function(baseTitle) {
        service._baseTitle = baseTitle
    }

    service.setTitle = function(title) {
        $window.document.title = service._baseTitle + title
    }

    return service
}


})(); // IIFE end
