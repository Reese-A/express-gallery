const express = require('express');
const gallery = require('./gallery');
const users = require('./users');

const router = express.Router();

router.use('/users', users);
router.use('/gallery', gallery);

module.exports = router;