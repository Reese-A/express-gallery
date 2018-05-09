const express = require('express');
const validateRequest = require('../../utilities/validateRequest');
const messages = require('../../utilities/messages');
const User = require('../../db/models/User');

const router = express.Router();

router.route('/register')
  .get((req, res)=>{
    return res.render('users/register');
  })

router.route('/')
  .post((req, res) =>{
    let {username, password} = req.body;

    username = username.trim();

    validateRequest([username, password], res, messages.badRequest);

    return new User({
      username,
      password,
    })
    .save()
    .then((user)=>{
      return res.redirect('/');
    })
  })

module.exports = router;