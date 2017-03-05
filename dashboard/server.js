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
//client_id: config.oauth_client_id, //your GitHub client_id
//client_secret: config.oauth_client_secret,  //and secret
var config = require('./sql_config.json');
var sql = mysql.createConnection(config.mysql);

var app = express();

// constants for directories
var webpages = __dirname + '/webpages/';
var test = __dirname + '/webpages/test/';
var localimg = webpages + 'img/';
var webimg = '/img/';
var uploads = __dirname + '/uploads/';

// multer is a package that handles file uploads nicely
var uploader = multer({
  dest: uploads,
  limits: { // for security
    fields: 10,
    fileSize: 1024*1024*20,
    files: 1,
  }
});

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
app.get('/authorized', authorized);

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

  if(req.query.newUser == "true"){

    // insert new user into the db
    sql.query(sql.format('INSERT INTO user SET ?', user), function (err, result) {
      if (err) return error(res, 'failed sql insert', err);

      res.json({id: result.id, firstName: user.firstname});
    });

  }else{

    // update existing user only fields token, photo, gid
    sql.query(sql.format('UPDATE user SET gtoken = ? , photo = ? WHERE gid = ?', [user.gtoken, user.photo, user.gid ]), function (err, result) {
      if (err) return error(res, 'failed sql insert', err);

      res.json({firstName: user.firstname});
    });

  }

}



function GitAuth(req, res) {
  //var uri = res.parse(res.url);
  var values = qs.parse(req.query);
  var state = true;
  // Check against CSRF attacks
  if (!state || state[1] != values.state) {
    res.writeHead(403, {'Content-Type': 'text/plain'});
    res.end('');
  } else {
    github.auth.login(values.code, function (err, token) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(token);
    });
  }

}

function authorized(req, res) {
  var code = '6ba1964b7c87a3dca7bb93ec5b73330183815ffa';
  var data = qs.stringify({
      client_id: config.oauth_client_id, //your GitHub client_id
      client_secret: config.oauth_client_secret,  //and secret
     code: code   //the access code we parsed earlier
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
        console.log(qs.parse(body).access_token);
        res.end(qs.parse(body).access_token);
        //  cb(null, qs.parse(body).access_token);
      });
  });

  req.write(data);
  req.end();
  req.on('error', function(e) { cb(e.message); });
}
function getUserName(req, res){
  sql.query(sql.format('SELECT firstname, lastname, photo FROM user WHERE gid = ?', [req.query.gid]), function (err, data) {
    if (err) return error(res, 'failed to get filename for deletion', err);

    return res.json(data[0]);
  });
}

function error(res, msg, error) {
  res.sendStatus(500);
  console.error(msg, error);
}
