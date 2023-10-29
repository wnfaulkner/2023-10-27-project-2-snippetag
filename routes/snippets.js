//SNIPPETS ROUTER

const express = require('express');
const router = express.Router();
const passport = require('passport');
const snippetsController = require("../controllers/snippets.js")

//router.get('/', indexController.index);

router.get('/new', snippetsController.new);

router.post('/', snippetsController.create);

router.get('/edit', snippetsController.edit);

module.exports = router;