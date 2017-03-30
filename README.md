# A Dashboard for developers.

A simple dashboard for everyday use. Its purpose is to show most recent commits to all your repositories, entertain and help with structured information.

## Users

A user can have unlimited number of dashboards. A dashboard can be deleted which is an irreversible action. Every single dashboard can have different settings depending on what the user wants.

### Current features
+ Configuration
Every dashboard is configured individually trough the UI. The user goes trough a few pages to authorize his github account and choose the news providers from the list. You can show/hide(news, jokes, issues) sections in order to make your dashboard fit your needs.
+ Articles from your favorite news providers
The Dashboard uses a http://newsapi.com to provide your favorite news. A random one is shown to the UI with an image title and QR code is generated.
+ Active issues for all repositories
After the user has authorized their Github account a token is saved in order to use their API and show all present issues for the authorized user. Changes every 5 minutes so if the user creates a new task or resolves one this will take effect on the dashboard.
+ Random joke
Random joke is shown to the UI using http://icndb.com to provide a random joke changing every 5 minutes.
+ Reminder
Shows a popup message reminding you to stretch out every half hour aiming people to stop looking at their screen for a moment.
## Developers

###  Testing
Unit tests for the API are created via mocha and supertest npm modules. To run them
run "npm run test" (their contents are in test.js in the main folder).

### Running the server
The server is being started with the command "npm run dashboard".
**N.B.** If you're using a mac it will require sudo rights("sudo npm run dashboard").

###  Documentation
Extra effort was put into documentation of the API. Special comments are written in the server in order to use a node module to represent them nicely in a UI. The API documentation can be accessed on /doc.

### Setup
The setup assumes that you have mysql as well as git and npm installed. If you want to install the software follow those steps:

+ git clone https://github.com/ivanlebanov/webscript_dashboard.git
+ npm install
+ create your own github app and change the oauthClientId and clientSecret in dashboard/sql_init.sql
+ change mysql setting according to your personal
+ change base in dashboard/webpages/js/config.json
+ run "npm run initsql"

### Contribution
If you want to contribute you have to:
1. Create tests for your endpoint
2. Create your API endpoint
3. Incorporate it in the dashboard as a separate module
4. Make a pull request

## Future planned enhancements:
+ advertisements
+ better UI for deleting of a dashboard
+ additional unit tests  
+ add a limitation to the API usage per IP address in order to stop hacker attacks if needed
+ creating more tests on UI and server
