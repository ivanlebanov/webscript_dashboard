# A Dashboard for developers.

A simple dashboard for everyday use. Its purpose is to show most recent commits to all your repositories, entertain and help with structured information.

## Running the server
The server is being started with the command "npm run dashboard".
**N.B.** If you're using a mac it will require sudo rights("sudo npm run dashboard").

## Functionality
Every single dashboard can have different settings depending on what the user wants.
A user can have unlimited number of dashboards. They have a few interesting functionalities:
+ lists random news article for selected providers
+ lists active issues for all repositories of the authorized user
+ uses http://icndb.com to provide a random joke changing every now and then
+ shows a popup message reminding you to stretch out every half hour

## API documentation
The API documentation can be accessed on /doc.

## Future enhancements:
+ advertisements
+ running tests on UI and server

## Setup
The setup assumes that you have mysql as well as git installed. If you want to install the software follow those steps:

+ git clone https://github.com/ivanlebanov/webscript_dashboard.git
+ npm install
+ create your own github app and change the oauthClientId and clientSecret
+ change mysql setting according to your personal
+ run "npm run dashboard"
