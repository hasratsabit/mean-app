const express = require('express');
const router = express.Router();
const authRoute = require('./authentication');
const blogsRoute = require('./blogs');




router.use('/authentication', authRoute);
router.use('/blogs', blogsRoute);
module.exports = router;
