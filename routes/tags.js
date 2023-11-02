//TAGS ROUTER

const express = require('express');
const router = express.Router();
const passport = require('passport');
const tagsController = require("../controllers/tags.js")

router.get('/', tagsController.index);

module.exports = router;