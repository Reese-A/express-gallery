const express = require('express');
const Gallery = require('../../db/models/Gallery');
const messages = require('../../utilities/messages');
const validateRequest = require('../../utilities/validateRequest');

const router = express.Router();


router.route('/new')
  .get((req,res) => {
    return res.render('gallery/new');
  });

router.route('/')
  .post((req, res) =>{
    let {author, link, description} = req.body;

    author = author.trim();
    link = link.trim();
    description = description.trim();

    validateRequest([author, link, description], res, messages.badRequest);

    return new Gallery ({author, link, description})
      .save()
      .then((gallery) => {
        return res.redirect('/gallery');
      })
      .catch((err) =>{
        return res.json({message: messages.internalServer});
      })
  })
module.exports = router;