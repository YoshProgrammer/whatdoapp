//TODO - Need to copy files over, DB files, run npm install, verify the npm install went fine
//TOOD - CONT - Make sure the apps runs and commit to github

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    path = require('path'),
    PORT = process.env.PORT || 3000,
    db = require(__dirname + '/config/db.js'),
    bcrypt = require('bcrypt'),
    methodOverride = require('method-override'),
    middleware = require('./middleware.js')(db),
    sendgrid  = require('sendgrid')(APIKEY);


app.use(bodyParser.json());

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./routes.js')(app, middleware, db, sendgrid); // pass our application into our routes

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('Express listening on port ' + PORT + '!');
    });
});


