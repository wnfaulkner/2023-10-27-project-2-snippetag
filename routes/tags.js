//TAGS ROUTER

const express = require('express');
const router = express.Router();
const passport = require('passport');
const tagsController = require("../controllers/tags.js")

router.get('/search', tagsController.search);

module.exports = router;