const express = require('express');
const router = express.Router();
const authRoute = require('./authentication');




router.use('/authentication', authRoute);
module.exports = router;
