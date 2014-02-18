bluemix-sample-tia-node - Twitter Influencer Analyzer (in node)
================================================================================

Twitter Influencer Analyzer is a web application which collects data from
Twitter, Klout and Google Maps to display influence relationships between 
twitter users.

 This is a Node.js app that uses the following cloud services:

 

 -   Company Text Analytics Service

 -   Name Text Analytics Services

 -   MongoDB

## License ##
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.


Installation
--------------------------------------------------------------------------------

You will need [node.js](http://nodejs.org/) installed (version 0.8.x or greater), 
which comes with `npm` (version 1.1.x or greater).

You will also need [MongoDB](http://www.mongodb.org/downloads) installed,
if you want to run the server locally.

Once you have that in order:

* create a git clone this repository; eg,

        git clone https://github.com/ibmjstart/bluemix-sample-tia-node.git
* navigate to the cloned directory

* run `npm install` to install node pre-req modules


configuration
--------------------------------------------------------------------------------

You should create a `config.json` in the root directory.  It's 
listed in `.gitignore`, so will not be stored in git.  A
sample is available in `config.json.txt`.

Set the Klout and Twitter keys as appropriate.

For Klout, you can obtain a developer key here: 
<http://klout.com/s/developers/home>

For Twitter, you can obtain a key and secret here:
<https://dev.twitter.com/>

Note that you just need simple keys here; for neither klout nor twitter will
the user ever "sign in" - this application only deals with public data.

To run locally, you will need a mongodb server running, at the URL: 
`mongodb://localhost:27017`.  It will use a database named 
`bluemix-sample-tia-node` when run locally.


running on the command-line
--------------------------------------------------------------------------------

use one of:

* `node app.js`
* `node lib/cli.js`
* `npm start`
* `./build.coffee serve` (`build serve` on Windows)
* `./build.coffee watch` (does not run on on Windows)

The first four all do the same thing.

`./build.coffee watch` is used at development time.  It will watch the source 
directories, and restart the server when they change.

The server will print the URL at which it's available after it's started.

You should see something like this when you run:

    bluemix-sample-tia-node: mongo: url: mongodb://localhost:27017/bluemix-sample-tia-node
    bluemix-sample-tia-node: connecting...
    bluemix-sample-tia-node: connected
    bluemix-sample-tia-node: ---------------------------------------------------------------
    bluemix-sample-tia-node: twitter bearer token retrieved
    bluemix-sample-tia-node: starting server on pid 82546 at http://localhost:8000


running on bluemix / cloud foundry
--------------------------------------------------------------------------------

To run the app on Bluemix, you will need to complete the following steps.

1. Login to Bluemix.
 * `$ cf login -a https://api.ng.bluemix.net`
2. Create an instance of the mongodb service.
 * `$ cf create-service mongodb 100 mongodbTIA`
3. From the cloned Twitter Influencer App directory, push the app without starting it.
 * `$ cf push twitterIA --no-manifest --no-start`
4. Bind the mongodb service to the new app
 * `$ cf bind-service twitterIA mongodbTIA`
5. Start the app
 * `$ cf start twitterIA`

    
(Note: the app has only been tested on node 0.8.x and above.)

That should be it!  Head over to your app's URL to start exploring!


running the app in the browser
--------------------------------------------------------------------------------

The app consists of 4 types of pages:

* the home page, which lists all the twitter users you have explored

* an individual's user page, displaying information about that user

* the messages page, displaying error and informational messages

* the help page, providing a legend of some of the symbols used

When you run the first time, there will be no users listed on the home page.
Enter one in the prompter on the page, and press the Analyze button.  That
should take you to the individual's user page.  When you traverse back to
home (press the back button - or you can always click the 'Home' link 
at the top), you'll see that user in the list.  As you
explore more users, they will be pushed to the top of the list.

The list provides a "delete" button to remove the user from the list,
a green badge showing their klout score, a search icon button which will display
the individual's user page, and a twitter icon button which will take you
to the user's twitter page.

The list of users is stored in your browsers local storage - it's not saved
anywhere on the web.

The individual user page displays up to 4 things:

* list of twitter users this user is influenced by

* list of twitter users that are influenced by this user

* recent tweets

* a Google map if any tweets are geo-coded

For each of the influenced by and influences users, their klout score badget,
a search icon button, and twitter icon button are displayed.  Click on the
search icon button to display that user's individual user page.

For tweets which are geo-coded, a numeric badge link is displayed; click on
that bad to display the referenced location in Google Maps.


what the app does in the browser
--------------------------------------------------------------------------------

The web app is contructed as a single-page-app using 
[AngularJS](http://angularjs.org/).  The web resources - html, css, and js files
are located in the `www` directory.  Each 'page' in the app is designed as 
a separate html view, with a controller to go with, located in the
`www/controllers` directory.

The web app issues XHR requests back to the server to get dynamic data from 
klout and twitter.  To make the system appear non-laggy, the data previously
returned from an XHR request is shown on the web page before the more recent
data is returned from the server.  Often, the data won't change.

The list of users you've explored, and other not-frequently changing data
is persisted to `localStorage`, bypassing the need to store that personal
data 'in the cloud'.

Google maps are generated in the browser using the
[Google Static Maps API](https://developers.google.com/maps/documentation/staticmaps/).


what the app does on the server
--------------------------------------------------------------------------------

The server does three basic things:

* serves static content for the web app - html, css, and js files

* serves XHR requests for klout and twitter data

* persists data in a MongoDB cache

XHR requests are first checked to see if there is a recent response value
in the MongoDB cache.  If there is, it's returned.  Otherwise, a request
is made of the appropriate service, and the response is then added to
the cache, for future requests.

The data in the MongoDB cache is expired, over time, using
[MongoDB's ttl expiration feature](http://docs.mongodb.org/manual/tutorial/expire-data/).
This feature requires version MongoDB 2.2.

copyright
--------------------------------------------------------------------------------

    Copyright IBM Corp. 2013 All Rights Reserved                     
    
    NOTICE TO USERS OF THE SOURCE CODE EXAMPLES               
                                                                     
    The source code examples provided by IBM are only intended to    
    assist in the development of a working software program.         
                                                                     
    International Business Machines Corporation provides the source  
    code examples, both individually and as one or more groups,      
    "as is" without warranty of any kind, either expressed or        
    implied, including, but not limited to the warranty of           
    non-infringement and the implied warranties of merchantability   
    and fitness for a particular purpose. The entire risk            
    as to the quality and performance of the source code             
    examples, both individually and as one or more groups, is with   
    you. Should any part of the source code examples prove defective,
    you (and not IBM or an authorized dealer) assume the entire cost 
    of all necessary servicing, repair or correction.                
                                                                     
    IBM does not warrant that the contents of the source code        
    examples, whether individually or as one or more groups, will    
    meet your requirements or that the source code examples are      
    error-free.                                                      
                                                                     
    IBM may make improvements and/or changes in the source code      
    examples at any time.                                            
                                                                     
    Changes may be made periodically to the information in the       
    source code examples; these changes may be reported, for the     
    sample code included herein, in new editions of the examples.    
                                                                     
    References in the source code examples to IBM products, programs,
    or services do not imply that IBM intends to make these          
    available in all countries in which IBM operates. Any reference  
    to the IBM licensed program in the source code examples is not   
    intended to state or imply that IBM's licensed program must be   
    used. Any functionally equivalent program may be used.           
    
