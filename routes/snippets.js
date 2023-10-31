//SNIPPETS ROUTER

const express = require('express');
const router = express.Router();
const passport = require('passport');
const snippetsController = require("../controllers/snippets.js")

//router.get('/', indexController.index);

router.get('/new', snippetsController.new);

router.post('/', snippetsController.create);

router.get('/edit', snippetsController.index);

router.delete('/:id', snippetsController.delete);

router.post('/:id', snippetsController.addTag)

router.delete('/:id/remove-tag', snippetsController.removeTag)

router.get('/search', snippetsController.renderSearchPage);

router.get('/search/tag', snippetsController.search);

module.exports = router;