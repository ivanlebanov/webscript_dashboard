/* jshint node: true */
'use static';

var https   = require('https');
var express = require('express');
var mysql = require('mysql');
var qs = require('querystring');
var config = require('./sql_config.json');
var sql = mysql.createConnection(config.mysql);
var bodyParser = require('body-parser');
var app = express();

const webpages = __dirname + '/webpages/';

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
// logging
app.use('/', function(req, res, next) {
   console.log(new Date(), req.method, req.url); next();
 });

// User
app.post('/api/login', login);
app.get('/api/user', getUser);

// Github
app.get('/github_authorized', GitAuth);
app.post('/api/authorize', authorized);
app.get('/api/user/:id/issues', getIssues);

// dashboards
app.get('/api/dashboards/:gid', getUserDashboards);
app.get('/api/dashboard/:gid/:id', getSingleDashboard);
app.delete('/api/dashboard/:gid/:id', deleteSingleDashboard);
app.post('/api/dashboard/:gid', postUserDashboard);
app.put('/api/dashboard/:gid/:id', updteUserDashboard);

// News
app.get('/api/news', getAllNewsProviders);
app.get('/api/dashboard/:gid/:id/articles', getNewsArticles);
app.post('/api/dashboard/:id/news', postUserNews);

// Joke
app.get('/api/joke', getRandomJoke);
// static files
app.use('/', express.static(webpages, { extensions: ['html'] }));

// 404 not found page
app.use(function(req, res, next) {
    //var err = new Error('Not Found');
    //err.status = 404;
    res.redirect('http://localhost:8080/404');
    //next(err);
});
// start the server
app.listen(8080);
module.exports = app;


/* SERVER FUNCTIONS */


/**
 * @api {post} /api/login Login/Register User
 * @apiName login
 * @apiVersion 1.0.0
 * @apiGroup User
 *
 * @apiParam {String} id Users Google unique ID.
 * @apiParam {String} firstname Firstname of the User.
 * @apiParam {String} lastname Lastname of the User.
 * @apiParam {String} gtoken Token of the User retrieved from Google.
 * @apiParam {String} photo Photo of the User retrieved from Google.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstName": "John"
 *     }
 *
 * @apiDescription Login/Register a User with the information returned from the
 * Google API. If a user is uniquely identified by their google id their
 * profile will get updated otherwise a new user is created.
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

  sql.query(sql.format(
    'SELECT COUNT(*) AS countUsers FROM user WHERE gid = ?',
    [user.gid]), function (err, data) {
    if (err){ return error(res, 'failed getting user', err); }
    // choose to update or add a user
    var response = (data[0].countUsers > 0) ?
    updateUser(res, data, user) : addUser(res, data, user);
    res.json(response);
  });

}

function updateUser(res, data, user) {
  // update existing user
  sql.query(sql.format(
    'UPDATE user SET gtoken = ? , photo = ? WHERE gid = ?',
    [user.gtoken, user.photo, user.gid ]), function (err, result) {
    if (err){ return error(res, 'failed sql user update', err); }
    return {firstName: user.firstname};
  });
}

function addUser(res, data, user){
  // insert new user into the db
  sql.query(sql.format('INSERT INTO user SET ?', user), function (err, result) {
    if (err){ return error(res, 'failed sql user insert', err); }
    return {firstName: user.firstname};
  });
}

/**
 * @api {get} /api/user Get User info
 * @apiName getUser
 * @apiVersion 1.0.0
 * @apiGroup User
 *
 * @apiParam {String} gid Users Google unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "photo": "http://example.com/img.png"
 *     }
 *
 * @apiDescription A users information - their firstname, lastname
 * and photo(all previously gathered from the Google profile
 * the user logged in with).
*/
function getUser(req, res){
  sql.query(sql.format(
    'SELECT firstname, lastname, photo FROM user WHERE gid = ?',
    [req.query.gid]), function (err, data) {
    if (err) { return error(res, 'failded to load username', err); }
    if(data.length > 0){
      return res.json(data[0]);
    }else{
      res.json(null);
    }

  });
}

/**
 * @api {get} /api/dashboards/:gid Get User's Dashboards
 * @apiName getUserDashboards
 * @apiVersion 1.0.0
 * @apiGroup Dashboard
 *
 * @apiParam {String} gid Users Google unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "id": "1",
 *       "gid": "105498442129427323426",
 *       "title": "Test",
 *       "userNews": "nfl-news,techradar",
 *       "showIssues": "0",
 *       "showJoke": "1",
 *       "showNews": "1",
 *       "finishedSetup": "0"
 *     }]
 *
 * @apiDescription Get all dashboards a user has created.
*/
function getUserDashboards(req, res) {
  sql.query(sql.format(
    'SELECT * FROM dashboard WHERE gid = ?',
    [req.params.gid]), function (err, data) {
    if (err) { return error(res, 'failded to load username', err); }
    if(data.length > 0){
      return res.json(data);
    }else{
      res.json([]);
    }

  });
}

/**
 * @api {get} /api/dashboard/:gid/:id Get a Dashboard
 * @apiName getSingleDashboard
 * @apiVersion 1.0.0
 * @apiGroup Dashboard
 *
 * @apiParam {String} gid Users Google unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "1",
 *       "gid": "105498442129427323426",
 *       "title": "Test",
 *       "userNews": "nfl-news,techradar",
 *       "showIssues": "0",
 *       "showJoke": "1",
 *       "showNews": "1",
 *       "finishedSetup": "0"
 *     }
 *
 * @apiDescription Get a single dashboard.
 * a user has created.
*/
function getSingleDashboard(req, res) {
  sql.query(sql.format(
    'SELECT * FROM dashboard WHERE gid = ? AND id = ?',
    [req.params.gid, req.params.id]), function (err, data) {
    if (err) { return error(res, 'failded to load username', err); }
    if(data.length > 0){
      return res.json(data[0]);
    }else{
      res.json([]);
    }

  });
}

/**
 * @api {delete} /api/dashboard/:gid/:id Delete
 * @apiName deleteSingleDashboard
 * @apiVersion 1.0.0
 * @apiGroup Dashboard
 *
 * @apiParam {String} gid Users Google unique ID.
 * @apiParam {String} id Dashboard's unique identifier.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         status: 'success',
 *         message: 'Successfully deleted the dashboard.',
 *      }
 *
 * @apiDescription Delete a single dashboard.
*/
function deleteSingleDashboard(req, res) {
  sql.query(sql.format(
    'DELETE FROM dashboard WHERE gid = ? AND id = ?',
    [req.params.gid, req.params.id]), function (err, data) {
    if (err) { return error(res, 'failded to load username', err); }

      return res.json({
        status: 'success',
        message: 'Successfully deleted the dashboard.',
      });

  });
}

/**
 * @api {post} /api/dashboard/:gid Create
 * @apiName postUserDashboard
 * @apiVersion 1.0.0
 * @apiGroup Dashboard
 *
 * @apiParam {String} gid Users Google unique ID.
 * @apiParam {String} title Dashboard's title.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         status: 'success',
 *         message: 'Successfully created a dashboard.',
 *      }
 *
 * @apiDescription Create a dashboard with default settings.
*/
function postUserDashboard(req,res) {
  var postParams = {
    title: req.body.title,
    gid: req.params.gid,
    showIssues: 1,
    showJoke: 1,
    showNews: 1,
    finishedSetup: 0
  };
  sql.query(sql.format(
    'INSERT INTO dashboard SET ?',
    postParams), function (err, data) {
    if (err) { return error(res, 'failded to create dashboard', err); }


    return res.json({
      status: 'success',
      message: 'Successfully created a dashboard.',
    });


  });
}

/**
 * @api {put} /api/dashboard/:gid/:id Update
 * @apiName updteUserDashboard
 * @apiVersion 1.0.0
 * @apiGroup Dashboard
 *
 * @apiParam {String} gid Users Google unique ID.
 * @apiParam {String} id Dashboard's unique identifier.
 * @apiParam {String} title Dashboard's title.
 * @apiParam {String} showIssues setting either 0 or 1.
 * @apiParam {String} showJoke setting either 0 or 1.
 * @apiParam {String} showNews setting either 0 or 1.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         status: 'success',
 *         message: 'Successfully updated a dashboard.',
 *      }
 *
 * @apiDescription Update a dashboard with selected settings
 * by the user.
*/
function updteUserDashboard(req, res) {

  sql.query(sql.format(
    'UPDATE dashboard SET title = ? , showIssues = ?,' +
    'showJoke = ?, showNews = ? WHERE gid = ? AND id = ?',
    [req.body.title, req.body.showIssues, req.body.showJoke, req.body.showNews,
    req.params.gid, req.params.id]
  ), function (err, data) {
    if (err) { return error(res, 'failded to update dashboard', err); }


    return res.json({
      status: 'success',
      message: 'Successfully updated dashboard.',
    });


  });
}


/**
 * @api {get} /github_authorized Redirect authorized user
 * @apiName GitAuth
 * @apiVersion 1.0.0
 * @apiGroup Github
 *
 * @apiParam {String} code Code returned after the user has authorized their Git
 *
 * @apiDescription Redirects to a authorize page so the user which has just
 * authorized can be linked with their profile using their Google id.
*/
function GitAuth(req, res) {
  res.redirect('/authorize?code=' + req.query.code );
  res.end();
}

/**
 * @api {post} /api/authorize Save token
 * @apiName authorized
 * @apiVersion 1.0.0
 * @apiGroup Github
 *
 * @apiParam {String} gid Users Google unique ID.
 * @apiParam {String} code Code returned after the user has authorized their Git
 *
 * @apiDescription Makes an https request to Github's API with code
 * provided by them for a successful authorization of a Github user. The
 * returned token is saved in the database.
*/
function authorized(req, res) {
  var gid = req.query.gid;

  var data = qs.stringify({
      'client_id': config.oauthClientId, // GitHub client_id
      'client_secret': config.clientSecret,  //github secret
      'code': req.query.code   //the access code we parsed earlier
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
        sql.query(sql.format(
          'UPDATE user SET gittoken = ? WHERE gid = ?',
          [qs.parse(body).access_token, gid ]), function (err, result) {
          if (err){ return error(res, 'failed gittoken update', err); }
        });
      });
  });

  req.write(data);
  req.end();
  res.redirect('/authorized' );
  req.on('error', function(e) { cb(e.message); });
}

/**
 * @api {get} /api/user/:id/issues List issues
 * @apiName getIssues
 * @apiVersion 1.0.0
 * @apiGroup Github
 *
 * @apiParam {String} id Users Google unique ID.
 *
 * @apiDescription Makes an https request to the Github API
 * to list all tasks which haven't been resolved from all
 * User's repositories.
*/
function getIssues(req, res) {

  sql.query(sql.format(
    'SELECT gittoken FROM user WHERE gid = ?',
    [req.params.id]), function (err, data) {
      if (err){ return error(res, 'user not found', err); }

      if(data.length > 0){

        var reqOptions = {
            host: 'api.github.com',
            path: '/issues?access_token='  + data[0].gittoken,
            method: 'GET',
            headers: {'User-Agent': 'Uboard'}
          };

        callback = function(response) {
          var str = '';
          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) { str += chunk; });
          //the whole response has been recieved, so we just return it
          response.on('end', function () { return res.send(str); });
        };

        https.request(reqOptions, callback).end();

      }else{
        return res.json({
           status  : 'error',
           message : 'The user is not found'
         });
      }
  });
}

/**
 * @api {get} /api/news List News Providers
 * @apiName getAllNewsProviders
 * @apiVersion 1.0.0
 * @apiGroup News
 *
 * @apiDescription Makes an https request to the NewsAPI
 * to list all news providers accessible in their API.
*/
function getAllNewsProviders(req, res) {

  var reqOptions = {
      host: 'newsapi.org',
      path: '/v1/sources?language=en&apiKey='  + config.newsapiKey,
      method: 'GET'
    };

  callback = function(response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) { str += chunk; });
    //the whole response has been recieved, so we just return it
    response.on('end', function () { return res.send(str); });
  };

  https.request(reqOptions, callback).end();
}

/**
 * @api {get} /api/dashboard/:id/articles Get Random News Articles List
 * @apiName getNewsArticles
 * @apiVersion 1.0.0
 * @apiGroup News
 *
 * @apiParam {String} id dashboard's ID
 * @apiParam {String} gid Users Google unique ID.
 *
 * @apiDescription Makes an https request to the NewsAPI
 * to list recent articles for a random provider
 * chosen previously from the User.
*/
function getNewsArticles(req, res) {

  sql.query(sql.format(
    'SELECT userNews FROM dashboard WHERE gid = ? AND id = ?',
    [req.params.gid, req.params.id]), function (err, data) {
      if (err) { return error(res, 'user not found', err); }
      if(data.length > 0){
        var news = data[0].userNews.split(',');

        var item = news[Math.floor(Math.random()*news.length)];
        var source = item + '&language=en&apiKey='  + config.newsapiKey;
        var reqOptions = {
          host: 'newsapi.org',
          path: '/v1/articles?source=' + source,
          method: 'GET'
        };

         callback = function(response) {
          var str = '';

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

  });
}
/**
 * @api {post} /api/dashboard/:id/news Save Prefered News providers
 * @apiName postUserNews
 * @apiVersion 1.0.0
 * @apiGroup News
 *
 * @apiParam {String} id dashboard's ID.
 * @apiParam {String} gid Users Google unique ID.
 * @apiParam {String} sources comma separated list of provider ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiDescription Saves the unique news identifiers in the
 * database for the specific dashboard and sets the
 * finishedSetup flag to 1.
*/
function postUserNews(req, res) {
  sql.query(sql.format(
    'UPDATE dashboard SET userNews = ? , finishedSetup = 1 ' +
    ' WHERE gid = ? AND id = ?',
    [ req.query.sources, req.query.gid , req.params.id ]),
     function (err, result) {
       if (err){ return error(res, 'failed sql insert', err); }

       return res.json({
          status  : 'success',
          message : 'Successfully selected news'
        });
    });
}

/**
 * @api {get} /api/joke Get Random Joke
 * @apiName getRandomJoke
 * @apiVersion 1.0.0
 * @apiGroup Joke
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "type": "success",
 *      "value": {
 *        "id": 491,
 *        "joke": "Chuck Norris doesn't use reflection, reflection asks
 *        politely for his help.",
 *        "categories": ["nerdy"]
 *        }
 *      }
 *
 * @apiDescription Returns json object with a random joke from
 * the nerdy category if the icdnb api(https://icndb.com).
*/
function getRandomJoke(req, res) {

  var reqOptions = {
      host: 'api.icndb.com',
      path: '/jokes/random?limitTo=[nerdy]',
      method: 'GET'
    };

  var callback = function(response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) { str += chunk; });
    //the whole response has been recieved, so we just return it
    response.on('end', function () { return res.send(str); });
  };

  https.request(reqOptions, callback).end();
}

function error(res, msg, error) {
  res.sendStatus(500);
  console.error(msg, error);
}

function cb(message) {
  console.error(message + ' ' + new Date());
}
