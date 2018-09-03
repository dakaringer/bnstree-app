var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var helmet = require('helmet')

var dbConfig = require('./config/db');
var User = require('./models/user');
mongoose.connect(dbConfig.url);

var routes = require('./routes/index');
var login = require('./routes/login');
var ajax = require('./routes/ajax');
//var schedule = require('./schedule');

var app = express();
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'a6fehmXv9kTZsJEN',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, function (err, user) {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: '971069116209-bbqbn8j1h555o4888oej0ts53o4e4fkq.apps.googleusercontent.com',
        clientSecret: 'jLaVCVhroFsAqDOOuk9nb6we',
        //callbackURL: "http://localhost:3000/auth/google/return"
        callbackURL: "https://bnstree.com/auth/google/return"
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            _id: profile.id
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                //return done(err, false);
                user = new User();
                user._id = profile.id;
                if (profile.nickname && profile.nickname != "") {
                    user.username = profile.nickname;
                }
                else {
                    user.username = profile.displayName;
                }
                user.startName = user.username;
                user.liked = [];
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(err, user);
                });
            } else {
                if (user.username == "") {
                    if (profile.nickname && profile.nickname != "") {
                        user.username = profile.nickname;
                    }
                    else {
                        user.username = profile.displayName;
                    }

                }
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(err, user);
                });
            }
        });
    }
));


//app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.use('/', ajax);
app.use('/', login);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//var acebot = require('./acebot');

module.exports = app;
