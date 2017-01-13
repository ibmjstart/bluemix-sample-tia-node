Twitter Influencer Analyzer (Node.js)
================================================================================

Twitter Influencer Analyzer is a web application which collects data from
Twitter, Klout and Google Maps to display influence relationships between
twitter users.

 This is a Node.js app that uses the following cloud services:
 -   Cloudant NoSQL DB
 
Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix. Note the app will not yet work; you need to set the environment variables (discussed below).

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ibmjstart/bluemix-sample-tia-node.git)

### Getting Your Environment Variables (Twitter and Klout API Keys) ###

Before you set up your environment variables, you will need to find your callback URL, which is just the URL the app will be running on:

1. Once you click on the "Deploy to Bluemix" button above, you will be taken to a page and will either need to log in or create a Bluemix account.

2. Once you have signed in, click on the blue "Deploy" button on the bottom right corner, and wait for it to finish creating and configuring your application. Again, your app will not yet be successfully deployed as your environment variables are not set up yet. Your screen should look like this:

 ![image](images/App Deploy.png)

3. Go to www.bluemix.net, and use the hamburger menu at the top right hand corner to to go to your Application Dashboard. Find our application (it should have the prefix "bluemix-sample-tia-node" followed by your username and a unique number sequence.

4. Copy the application's Route URL and save it to your clipboard. 

Before you can get your app running, you need to get Twitter and Klout API keys and set up your environment variables on B Bluemix. 

5. To get your Twitter API Keys, go here: 
<https://apps.twitter.com> 

6. Sign into your twitter account, click on "create new app", and fill out the form. For the callback URL, enter your Bluemix app's route URL you copied to your clipboard earlier. 

7. Once you have generated your Twitter app, navigate to Keys and Access Tokens, locate your Consumer Key and Consumer Secret. We will come back to this later.

8. Next, we will be generating our Klout API Keys. Go to <http://klout.com/s/developers/home>, and similar to what we did for the Twitter API, create a new app, fill out the form, and enter your Bluemix app's route URL for the callback URL section on the Klout API form. 

9. Once you have your Klout API keys generated, go back to www.bluemix.net, find your app on your Dashboard, click on it, and use the left panel to navigate to "Runtime". 

10. Once you're in the Runtime section, click on "Environment Variables", and add your Twitter and Klout API keys as shown below: (make sure the environemnt variable names match EXACTLY what is shown below, as in your Twitter API key should be named "twitterkey", your Twitter Consumer Secret "twittersecret", and your Klout Key "kloutkey")

![image](images/Environment Variables.png)

Hit save and you're done! Your app is now live! In order to access it, go back to to the dashboard, and click on your app's Route URL. 

### Alternatively, Deploy Your App Via Command Line (CLI) ###

### Prerequisites ###

Before we begin, we first need to install the [**Bluemix Command Line Tool**] (http://clis.ng.bluemix.net/ui/home.html) as well as the [**CF Command Line Tool**](https://github.com/cloudfoundry/cli/releases) that will be used to upload and manage your application. If you've previously installed an older version of the cf tool, make sure you are now using cf v6 by passing it the -v flag:

    cf -v

In the terminal, go to the directory of your app and follow these steps:

1. Create a git clone of this repository.
        git clone https://github.com/ibmjstart/bluemix-sample-tia-node.git

2. Login to Bluemix.

   | *usage:*   | `$ cf login [-a API_URL]`|
   |:-----------|:---------------------------------------------|
   | *example:* | `$ cf login -a https://api.ng.bluemix.net`   |

3. Create an instance of the cloudantdb service. Be sure to make the service instance name exactly "Cloudant-tia" as that's required by the manifest.yml file.

   | *usage:*   | `$ cf create-service SERVICE PLAN SERVICE_INSTANCE_NAME` |
   |:-----------|:---------------------------------------------------------|
   | *example:* | `$ cf create-service cloudantnosqldb Lite Cloudant-tia`|

   From the cloned Twitter Influencer root directory, push the app without starting it (we need to first set the environment variables before we can run it). o long as you used Cloudant-tia for your database name. Also note that the app's name (APP) is used for the hostname of the application by default; therefore, be sure to use something unique such as "tia-" followed by your username so that it does not conflict with other user apps.

 | *usage:*   | `$ cf push APP --no-start [-c COMMAND]`           |
 |:-----------|:--------------------------------------------------------------------|
 | *example:* | `$ cf push tia-<username> --no-start -c "node app.js"`|

 The -c flag is used to specify the start command that should be used by CloudFoundry when it runs your app.

4. Now we need to set the environment variables. We have three: the twitter key, twitter consumer secret, and the klout key. When we set these variables make sure to use "twitterkey", "twittersecret", and "kloutkey" as the names of these environment variables or the app will not work.

 | *usage:*   | `$ cf set-env APP ENV_NAME VALUE`|
 |:-----------|:--------------------------------------------------------|
 | *example:* | `$ cf set-env tia-<username> twitterkey <your twitter key>`|

 Do this three times for each environment variable: twitterkey, twittersecret, and kloutkey.

5. Now we are ready to start the app!

 | *usage:*   | `$ cf start APP`|
 |:-----------|:--------------------------------------------------------|
 | *example:* | `$ cf start tia-<username>`|

That's it! For instructions on usage, please see [Using the App from the Browser](#using-the-app-from-the-browser) or just head over to your app's URL (such as http://tia-&lt;username&gt;.mybluemix.net) to start exploring!
___

### Running locally ###

You will need [node.js](http://nodejs.org/) installed (version 0.10.x or greater),
which comes with `npm` (version 1.1.x or greater).

You will also need an instance of [CloudantDB](https://ace.ng.bluemix.net/) running on
`https://ace.ng.bluemix.net/`.  You will also need to get the "environment variables"
from bluemix (specifically the cloudant "url") and hardcode the application to call
the cloudant api via the url when run locally.  In cloudant.js, set the CLOUDANT_URL
variable to be the url from the bluemix Environment Variables.

In order to do this, go to your Bluemix applications dashbaord, and click on your Cloudant service. Once there, click on the "Service Credentials" tab, 

![image](images/Cloudant.paint)

Once you have that in order:

* create a git clone this repository; eg,

        git clone https://github.com/ibmjstart/bluemix-sample-tia-node.git
* navigate to the cloned directory

* run `npm install` to install node pre-req modules

Finally, to run the app, use one of:

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

    bluemix-sample-tia-node: cloudant: url: https://736e4510-fa78-49a...bluemix.cloudant.com
    bluemix-sample-tia-node: ---------------------------------------------------------------
    bluemix-sample-tia-node: twitter bearer token retrieved
    bluemix-sample-tia-node: starting server on pid 82546 at http://localhost:8000

___

## Using the App from the Browser ##

The app consists of 4 pages:

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


### What the App Does in the Browser ###

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


### What the App Does on the Server ###

The server does three basic things:

* serves static content for the web app - html, css, and js files
* serves XHR requests for klout and twitter data
* persists data in a CloudantDB cache

XHR requests are first checked to see if there is a recent response value
in the CloudantDB cache.  If there is, it's returned.  Otherwise, a request
is made of the appropriate service, and the response is then added to
the cache, for future requests.

## License ##
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
