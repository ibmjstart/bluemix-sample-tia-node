#!/usr/bin/env node_modules/.bin/coffee

# Copyright IBM Corp. 2013 All Rights Reserved. See footer for details.

require "shelljs/global"

#-------------------------------------------------------------------------------
main = (command) ->
    switch command
        when "serve"  then  runServe()
        when "watch"  then  runWatch()
        when "images" then  runImages()
        else                printHelp()
    return

#-------------------------------------------------------------------------------
runServe = ->
    require "./app.js"
    return

#-------------------------------------------------------------------------------
runWatch = ->
    if process.platform is "win32"
        console.log "sorry, the watch task doesn't work on windows"
        process.exit(1)

    execA """
        node_modules/.bin/node-supervisor 
            --quiet
            --watch lib,app.js,build.coffee
            --extensions js,coffee
            --no-restart-on error
            --exec node_modules/.bin/coffee
            -- build.coffee serve
    """

    return

#-------------------------------------------------------------------------------
runImages = ->
    # uses imagemagick to convert images

    sizes = [
        "032"
        "057"
        "064"
        "072"
        "096"
        "114"
        "128"
        "144"
        "256"
    ]

    for size in sizes
        execA """
            convert 
                -resize #{size}x#{size} 
                www/images/icon-512.png  
                www/images/icon-#{size}.png
        """

#-------------------------------------------------------------------------------
rmIfExistsDir = (dir) ->
    return unless test "-d", dir
    rm "-Rf", dir

#-------------------------------------------------------------------------------
execA = (cb, command) ->
    if !command?
        command = cb
        cb = ->

    if process.platform is "win32"
        command = command.replace /\//g, "\\"

    command = command.replace /\s\s+/g, " "
    exec command, -> cb()

#-------------------------------------------------------------------------------
printSection = (title) ->
    console.log ""
    console.log title
    console.log "-------------------------------------------"

#-------------------------------------------------------------------------------
printHelp = ->
    console.log """
        usage: build <task>

        where <task> is one of:
            serve  -  run server
            watch  -  run server, restart when source changes
            images -  rebuild images
            help   -  print this help

        note that the watch task does not work on windows
        """
    return

#-------------------------------------------------------------------------------
main process.argv[2]

#==================================================================
#                                                                  
# Copyright IBM Corp. 2013 All Rights Reserved                     
#                                                                  
#==================================================================
#                                                                  
#        NOTICE TO USERS OF THE SOURCE CODE EXAMPLES               
#                                                                  
# The source code examples provided by IBM are only intended to    
# assist in the development of a working software program.         
#                                                                  
# International Business Machines Corporation provides the source  
# code examples, both individually and as one or more groups,      
# "as is" without warranty of any kind, either expressed or        
# implied, including, but not limited to the warranty of           
# non-infringement and the implied warranties of merchantability   
# and fitness for a particular purpose. The entire risk            
# as to the quality and performance of the source code             
# examples, both individually and as one or more groups, is with   
# you. Should any part of the source code examples prove defective,
# you (and not IBM or an authorized dealer) assume the entire cost 
# of all necessary servicing, repair or correction.                
#                                                                  
# IBM does not warrant that the contents of the source code        
# examples, whether individually or as one or more groups, will    
# meet your requirements or that the source code examples are      
# error-free.                                                      
#                                                                  
# IBM may make improvements and/or changes in the source code      
# examples at any time.                                            
#                                                                  
# Changes may be made periodically to the information in the       
# source code examples; these changes may be reported, for the     
# sample code included herein, in new editions of the examples.    
#                                                                  
# References in the source code examples to IBM products, programs,
# or services do not imply that IBM intends to make these          
# available in all countries in which IBM operates. Any reference  
# to the IBM licensed program in the source code examples is not   
# intended to state or imply that IBM's licensed program must be   
# used. Any functionally equivalent program may be used.           
#==================================================================
