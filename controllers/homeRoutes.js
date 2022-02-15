const router = require('express').Router();
var path = require("path");
const { User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  if(req.session.logged_in) {
    res.redirect('/homepage');
    return;
  } else {
    res.redirect('/login');
    return;
  }
})

router.get('/game', async (req, res) => {
  // if(req.session.logged_in) {
  //   res.render('game');
  // } else {
  //   res.redirect('/login');
  //   return;
  // }
  res.render('game');

});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('login');
  });

module.exports = router;
