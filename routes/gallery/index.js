const express = require('express');
const Gallery = require('../../db/models/Gallery');
const messages = require('../../utilities/messages');
const validateRequest = require('../../utilities/validateRequest');
const isAuthenticated = require('../../utilities/isAuthenticated');

const router = express.Router();


router.route('/new')
  .get((req, res) => {
    return res.render('gallery/new');
  });

router.route('/')
  .post(isAuthenticated, (req, res) => {
    const user_id = req.user.id;

    let {
      author,
      link,
      description
    } = req.body;

    author = author.trim();
    link = link.trim();
    description = description.trim();

    if (!link.includes('http')){
      throw new Error(messages.badRequest);
    };

    if (!validateRequest([author, link, description])) {
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
        return res.redirect(`/gallery/${gallery.attributes.id}`);
      })
      .catch((err) => {
        return res.json({
          message: messages.internalServer
        });
      });
  })

  .get((req, res) => {
    console.log('USER', req.user)
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
    const user_id = req.user.id;
    if (!user_id) {
      return res.redirect('/')
    }
    const id = req.params.id;

    return new Gallery({
        id
      })
      .fetch()
      .then((gallery) => {
        if (!gallery) {
          throw new Error(messages.notFound);
        };
        if (gallery.attributes.user_id !== user_id) {
          throw new Error(messages.notAuthorized);
        };
        return gallery.destroy()
      })
      .then((gallery) => {
        return res.redirect('/gallery');
      })
      .catch((err) => {
        console.log(err);
        if (err.message === messages.notAuthorized) {
          return res.status(401).json({
            message: messages.notAuthorized
          });
        }
        if (err.message === 'No Rows Deleted') {
          return res.status(404).json({
            message: messages.notFound
          });
        }
        return res.status(500).json({
          message: messages.internalServer
        });
      })
  })

  .put((req, res) => {
    const user = req.user;

    if(user === undefined){
      return res.status(401).json({
        message: messages.notAuthorized,
      })
    }

    const user_id = user.id;
    if (!user_id) {
      return res.redirect('/')
    }
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
      .then((gallery) => {
        if (!gallery) {
          throw new Error(messages.notFound);
        };

        if (gallery.attributes.user_id !== user_id) {
          throw new Error(messages.notAuthorized);
        };

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
      .then((updatedGallery) => {
        return res.redirect(`/gallery/${id}`);
      })
      .catch((err) => {
        if(err.message === messages.notAuthorized){
          return res.status(401).json({message: messages.notAuthorized});
        };
        if (err.message === messages.badRequest) {
          return res.status(400).json({
            message: messages.badRequest
          });
        }
        if (err.message === messages.notFound) {
          return res.status(404).json({
            message: messages.notFound
          });
        }
        return res.status(500).json({
          message: messages.internalServer
        });
      })
  })

router.route('/:id/edit')
  .get((req, res) => {
    const id = req.params.id;

    const user = req.user;

    if(user === undefined){
      return res.redirect('/')
    }
  
    const user_id = req.user.id;

    return new Gallery()
      .where({
        id: id
      })
      .fetch()
      .then((gallery) => {
        if (!gallery) {
          throw new Error(messages.notFound);
        }

        if (gallery.attributes.user_id !== user_id) {
          throw new Error(messages.notAuthorized);
        };

        const data = gallery.attributes;

        return res.render('gallery/edit', data);
      })
      .catch((err) => {
        console.log(err);
        if(err.message === messages.notAuthorized){
          return res.status(401).json({
            message: messages.notAuthorized,
          })
        }

        if (err.message === messages.notFound) {
          return res.status(404).json({
            message: messages.notFound
          })
        } 
          return res.status(500).json({
            message: messages.internalServer
          });
        
      });
  })
module.exports = router;