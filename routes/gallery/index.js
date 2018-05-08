const express = require('express');
const Gallery = require('../../db/models/Gallery');

const router = express.Router();


router.route('/new')
  .get((req,res) => {
    return res.render('gallery/new');
  });

module.exports = router;