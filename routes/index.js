var express = require('express');
var router = express.Router();
var requireDirectory = require('require-directory');
var views = requireDirectory(module, '../views', {include: /server\.js$/});

router.get('/', views.index.server);
router.get('/wiki', views.wikicrawler.server.serve);
router.get('/wiki/get-page', views.wikicrawler.server.getPage);

module.exports = router;
