/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.controller("messages-controller", Controller)

//------------------------------------------------------------------------------
function Controller($scope, pageTitleSetter) {
    pageTitleSetter.setTitle("messages")

}

})(); // IIFE end
