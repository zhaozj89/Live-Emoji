var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new Strategy(
    function (username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (user.password != password) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});


// Load required modules
// var http    = require("http");              // http server core module
var https = require("https");              // http server core module
var express = require("express");           // web framework external module
var serveStatic = require('serve-static');  // serve static files
var fs = require('fs');

var private_key = fs.readFileSync('private.pem', 'utf8');
var certificate = fs.readFileSync('file.crt', 'utf8');
var credentials = {key: private_key, cert: certificate};

// Setup and configure Express http server. Expect a sub-folder called "static" to be the web root.
var app = express();
app.use(serveStatic('frontend'));
// app.use(serveStatic('frontend', {'index': ['/index.html']}));

// setting
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
    function (req, res) {
        res.render('login');
    });

app.get('/index',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.render('index', {user: req.user});
    });

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/index');
    });

app.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });

// app.listen(8080);

// Start Express http server on port 8080
var web_server = https.createServer(credentials, app).listen(8080);

//listen on port 8080
web_server.listen(8080, function () {
    console.log('listening on https://localhost:8080');
});