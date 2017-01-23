/*
 * A simple example of an API-based web app that stores pictures.
 */

'use static';
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var mysql = require('mysql');

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



app.post('/api/login', login);
app.get('/api/user', getUserName);
// static files
app.use('/', express.static(webpages, { extensions: ['html'] }));
app.use('/test', express.static(webpages, { extensions: ['html'] }));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.redirect('http://localhost:8080/404')
    next(err);
});
// start the server
app.listen(8080);



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
