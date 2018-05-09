const express = require('express');
const passport = require('passport');
const validateRequest = require('../../utilities/validateRequest');
const messages = require('../../utilities/messages');
const User = require('../../db/models/User');


const router = express.Router();

router.route('/register')
  .get((req, res) => {
    return res.render('users/register');
  });


router.route('/')
  .post((req, res) => {
    let {
      username,
      password
    } = req.body;

    username = username.trim();

    validateRequest([username, password], res, messages.badRequest);

    return new User({
        username,
        password,
      })
      .save()
      .then((user) => {
        return res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
        
        return res.status(500).json({
          message: messages.internalServer
        });
      });
  })

router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/'
  }))

  .get((req, res) => {
    return res.render('users/login');
  });

router.route('./logout')
  .get((req, res) => {
    req.logout();
    res.sendStatus(200);
  });

module.exports = router;