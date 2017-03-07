/*
 * A simple example of an API-based web app that stores pictures.
 */

'use static';
var fs = require('fs');
var https   = require('https');
var express = require('express');
var multer = require('multer');
var mysql = require('mysql');
var qs = require('querystring');
var github = require('octonode');

var config = require('./sql_config.json');
var sql = mysql.createConnection(config.mysql);

var app = express();

// constants for directories
var webpages = __dirname + '/webpages/';
var test = __dirname + '/webpages/test/';



// logging
app.use('/', function(req, res, next) { console.log(new Date(), req.method, req.url); next(); });


// server api
//   POST /api/pictures     - upload a picture and its title, returns {id: ..., title: ..., file: '/img/...'}
//   GET  /api/pictures     - list pictures ordered by time from most recent, returns [like above, like above, ...]
//         ?order=...       - ordered by title or submission time or random
//         ?title=...       - search by title substring
//   DELETE /api/pictures/x - returns http status code only


// you can also provide an OAuth token to authenticate the requests


app.post('/api/login', login);
app.get('/api/user', getUserName);
app.get('/github_authorized', GitAuth);
app.post('/api/authorize', authorized);
app.get('/api/news', getAllNewsProviders);
// static files
app.use('/', express.static(webpages, { extensions: ['html'] }));
app.use('/test', express.static(webpages, { extensions: ['html'] }));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.redirect('http://localhost:80/404');
    next(err);
});
// start the server
app.listen(80);



/* server functions
 *
 *
 *    ####  ###### #####  #    # ###### #####     ###### #    # #    #  ####  ##### #  ####  #    #  ####
 *   #      #      #    # #    # #      #    #    #      #    # ##   # #    #   #   # #    # ##   # #
 *    ####  #####  #    # #    # #####  #    #    #####  #    # # #  # #        #   # #    # # #  #  ####
 *        # #      #####  #    # #      #####     #      #    # #  # # #        #   # #    # #  # #      #
 *   #    # #      #   #   #  #  #      #   #     #      #    # #   ## #    #   #   # #    # #   ## #    #
 *    ####  ###### #    #   ##   ###### #    #    #       ####  #    #  ####    #   #  ####  #    #  ####
 *
 *
 */


/*
*  Login with the information returned from the Google API
*  and save some of user's information.
*/
function login(req, res) {
  // new user object

  var user = {
    gid: req.query.gid,
    firstname: req.query.firstName,
    lastname: req.query.lastName,
    gtoken: req.query.token,
    photo: req.query.photo
  };


    sql.query(sql.format('SELECT COUNT(*) AS countUsers FROM user WHERE gid = ?', [user.gid]), function (err, data) {
      if (err) return error(res, 'failed getting user', err);

      var response = addOrUpdateUser(data, user);

      res.json(response);


    });


}

function addOrUpdateUser(data, user) {
  if(data[0].countUsers > 0){

   // update existing user only fields token, photo, gid
   sql.query(sql.format('UPDATE user SET gtoken = ? , photo = ? WHERE gid = ?', [user.gtoken, user.photo, user.gid ]), function (err, result) {
     if (err) return error(res, 'failed sql insert', err);
     return {firstName: user.firstname};

   });
  }else{


   // insert new user into the db
   sql.query(sql.format('INSERT INTO user SET ?', user), function (err, result) {
     if (err) return error(res, 'failed sql insert', err);
     return {firstName: user.firstname};

   });

  }
}

function GitAuth(req, res) {
  var values = qs.parse(req.query);
  var state = true;
  res.redirect('/authorize?code=' + req.query.code );
  res.end();
}


function authorized(req, res) {
  var gid = req.query.gid;

  var data = qs.stringify({
      client_id: config.oauth_client_id, //your GitHub client_id
      client_secret: config.client_secret,  //and secret
      code: req.query.code   //the access code we parsed earlier
  });

  var reqOptions = {
      host: 'github.com',
      port: '443',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: { 'content-length': data.length }
  };

  var body = '';
   req = https.request(reqOptions, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function() {

        sql.query(sql.format('UPDATE user SET gittoken = ? WHERE gid = ?', [qs.parse(body).access_token, gid ]), function (err, result) {
          if (err) return error(res, 'failed gittoken update', err);

        });

      });
  });

  req.write(data);
  req.end();
  res.redirect('/authorized' );
  req.on('error', function(e) { cb(e.message); });
}


function getAllNewsProviders(req, res) {
  //  https://newsapi.org/v1/sources?language=en&sortBy=latest&apiKey=46a40b1ed79b4a96be26549ca314a24a

  var reqOptions = {
      host: 'newsapi.org',
      path: '/v1/sources?language=en&apiKey='  + config.newsapi_key,
      method: 'GET'
    };

  callback = function(response) {
    var str = "";

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just return it
    response.on('end', function () {
      return res.send(str);
    });
  };

  https.request(reqOptions, callback).end();
}

function getUserName(req, res){
  sql.query(sql.format('SELECT firstname, lastname, photo FROM user WHERE gid = ?', [req.query.gid]), function (err, data) {
    if (err) return error(res, 'failded to load username', err);
    if(data.length > 0)
      return res.json(data[0]);
    else
      res.json({});
  });
}

function error(res, msg, error) {
  res.sendStatus(500);
  console.error(msg, error);
}
