var express = require('express');
var router = express.Router();

var User = require('../models/user');
var passport = require('passport');

router.get('/auth/google', 
    passport.authenticate('google', {
        scope: 'https://www.googleapis.com/auth/plus.login'
}));

router.get('/auth/google/return',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect(req.session.redirectUrl || '/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect(req.session.redirectUrl || '/');
});

module.exports = router;