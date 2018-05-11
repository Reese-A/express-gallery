const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const validateRequest = require('../../utilities/validateRequest');
const messages = require('../../utilities/messages');
const User = require('../../db/models/User');

const saltedRounds = 12;
const router = express.Router();

router.route('/register')
  .get((req, res) => {
    return res.render('users/register');
  });


router.route('/')
  .get((req, res) => {
    return User
      .fetchAll({
        withRelated: ['gallery']
      })
      .then((users) => {
        // console.log(users.models[3].relations.gallery.models[0].attributes)
        // return res.json(getData)
        return res.render('users/listing', {
          users: users.models
        });
      })
      .catch((err) => {
        return res.status(500).redirect('/500.html');
      });
  })


  .post((req, res) => {
    let {
      username,
      password
    } = req.body;

    username = username.trim();

    validateRequest([username, password], res, messages.badRequest);

    bcrypt.genSalt(saltedRounds, function (err, salt) {
      if (err) {
        console.log(err);
      }
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }
        return new User({
            username,
            password: hash,
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
    })
  })



router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/'
  }))

  .get((req, res) => {
    return res.render('users/login');
  });

router.route('/logout')
  .get((req, res) => {
    req.logout();
    res.sendStatus(200);
  });


router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    return User
      .where({
        id: id
      })
      .fetch({
        withRelated: ['gallery']
      })
      .then((user)=>{
        if(!user){
          throw new Error(messages.notFound);
        };

        const detail = user.attributes;
        const getGallery = user.relations.gallery.models.map(data => {
          return data.attributes;
        });

        return res.render('users/detail', {
          detail: detail,
          listing: getGallery
        })
      })
      .catch((err)=>{
        if(err.message === messages.notFound){
          return res.status(404).redirect('/404.html');
        };

        return res.status(500).redirect('/500.html');
      });
  });

module.exports = router;