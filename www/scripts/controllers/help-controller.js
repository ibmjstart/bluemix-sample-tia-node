/*-------------------------------------------------------------------*/
/* Copyright IBM Corp. 2013 All Rights Reserved                      */
/*-------------------------------------------------------------------*/

;(function(){  // IIFE begin

TiaModule.controller("help-controller", Controller)

//------------------------------------------------------------------------------
function Controller($scope, pageTitleSetter) {
    pageTitleSetter.setTitle("help")
}

})(); // IIFE end
