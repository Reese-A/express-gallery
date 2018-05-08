const express = require('express');
const Gallery = require('../../db/models/Gallery');
const messages = require('../../utilities/messages');
const validateRequest = require('../../utilities/validateRequest');

const router = express.Router();


router.route('/new')
  .get((req, res) => {
    return res.render('gallery/new');
  });

router.route('/')
  .post((req, res) => {
    let {
      author,
      link,
      description
    } = req.body;

    author = author.trim();
    link = link.trim();
    description = description.trim();
    
    validateRequest([author, link, description], res, messages.badRequest);
    
    return new Gallery({
      author,
      link,
      description
    })
    .save()
    .then((gallery) => {
        return res.redirect('/gallery');
      })
      .catch((err) => {
        return res.json({
          message: messages.internalServer
        });
      });
  })

  .get((req, res) => {
    return Gallery.fetchAll()
      .then((listing) => {
        const getData = listing.models.map(data => {
          return data.attributes;
        });
        return res.render('gallery/listing', {
          listing: getData
        });
      })
      .catch((err) => {
        return res.json({
          message: messages.internalServer
        });
      });
  });

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    console.log('firecheck');
    return new Gallery()
      .where({
        id: id
      })
      .fetch()
      .then((detail) => {
        const mainCard = detail.attributes;
        return Gallery.query((qb) => {
            qb.limit(3);
          })
          .fetchAll()
          .then((listing) => {
            console.log(listing);
            const listingCards = listing.models.map((curr) => {
              return curr.attributes;
            })
            return res.render('gallery/detail', {
              mainCard: mainCard,
              listing: listingCards,
            })
          })
      })
  })

module.exports = router;