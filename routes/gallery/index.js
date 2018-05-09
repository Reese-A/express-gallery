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
    const user_id = req.session.passport.user.id;

    let {
      author,
      link,
      description
    } = req.body;

    author = author.trim();
    link = link.trim();
    description = description.trim();

    if(!validateRequest([author, link, description])){
      console.log(description.length);
      return res.status(400).json({
        message: messages.badRequest,
      });
    }

    return new Gallery({
        author,
        link,
        description,
        user_id,
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

    return new Gallery()
      .where({
        id: id
      })
      .fetch()
      .then((detail) => {
        const mainCard = detail.attributes;

        return Gallery.query((qb) => {
            qb.limit(3).where('id', '!=', id);
          })
          .fetchAll()
          .then((listing) => {
            console.log(listing.models);
            
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

  .delete((req, res) => {
    const id = req.params.id;

    return new Gallery({
        id: id
      })
      .destroy()
      .then((gallery) => {
        return res.redirect('/gallery');
      })
      .catch((err) => {
        if (err.message === 'No Rows Deleted') {
          return res.status(404).json({
            message: messages.notFound
          });
        } else {
          return res.status(500).json({
            message: messages.internalServer
          });
        }
      })
  })

  .put((req, res) => {
    const id = req.params.id;

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
      id: id
    })
    .fetch()
    .then((gallery)=>{
      if(!gallery){
        throw new Error(messages.notFound);
      }
      const updateObj = {
        author: author,
        link: link,
        description: description
      };
      return gallery.save(updateObj, {
        method: 'update',
        patch: true
      });
    })
    .then((updatedGallery)=>{
      return res.redirect(`/gallery/${id}`);
    })
    .catch((err) => {
      if(err.message === messages.notFound){
        return res.status(404).json({ message: messages.notFound });
      }
      return res.status(500).json({ message: messages.internalServer });
    })
  })

router.route('/:id/edit')
  .get((req, res) => {
    const id = req.params.id;

    return new Gallery()
      .where({
        id: id
      })
      .fetch()
      .then((gallery) => {
        if (!gallery) {
          throw new Error(messages.notFound);
        }
        const data = gallery.attributes;

        return res.render('gallery/edit', data);
      })
      .catch((err) => {
        if (err.message === messages.notFound) {
          return res.status(404).json({
            message: messages.notFound
          })
        } else {
          return res.status(500).json({
            message: messages.internalServer
          });
        }
      });
  })
module.exports = router;