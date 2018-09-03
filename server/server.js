delete process.env.BROWSER

require('dotenv').config({silent: true})
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')

const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const dbObj = require('./db')
const db = dbObj.db
const users = db.collection('users')

const routes = require('./routes/index')
const generalApi = require('./api/general')
const trainerApi = require('./api/trainer')
const trainer2Api = require('./api/trainer2')
const mixerApi = require('./api/mixer')
const characterApi = require('./api/character')

const app = express()
app.use(helmet())
app.use(compression())

let callbackURL = 'https://bnstree.com/auth/google/return'
if (process.env.NODE_ENV !== 'production') {
    console.log('DEVOLOPMENT ENVIRONMENT')

    if (!process.env.WEBPACK_DEV_OFF) {
        const webpackDevHelper = require('./index.dev.js')
        webpackDevHelper.useWebpackMiddleware(app)
    }
    else {
        app.use('/js', express.static(__dirname + '../public/js'))
    }
    callbackURL = 'http://localhost:3000/auth/google/return'

    app.use(logger('dev'))
}
else {
    console.log('PRODUCTION ENVIRONMENT')

    //Production needs physical files! (built via separate process)
    app.use('/js', express.static(__dirname + '../public/js'))

    require('./routes/scheduler')
    require('./discordBot/bot')
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, '../public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

let sess = {
    store: new mongoStore({url: dbObj.connectionURI}),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {}
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sess.cookie.secure = true
}
app.use(session(sess))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function (user, done) {
    done(null, user._id)
})
passport.deserializeUser(function (id, done) {
    users.findOne({_id: id}, function (err, user) {
        done(null, user)
    })
})

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
}, function(accessToken, refreshToken, profile, done) {
    users.findOne({_id: profile.id}, (err, user) => {
        if (err) {
            return done(err)
        }

        if (!user) {
            user = {
                _id : profile.id,
                email: profile.emails[0].value
            }
        }
        user.displayName = profile.displayName
        user.profilePic = profile.photos[0].value

        users.save(user)
        return done(err, user)
    })
}))

app.use('/', routes)
app.use('/api/general', generalApi)
app.use('/api/trainer', trainerApi)
app.use('/api/trainer2', trainer2Api)
app.use('/api/mixer', mixerApi)
app.use('/api/character', characterApi)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app
