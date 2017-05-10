var wikipedia = require("node-wikipedia");
var url = require('url');
var h2p = require('html2plaintext');
var sentiment = require('sentiment');
var _ = require('lodash');


module.exports = {

  serve: function(req, res, next) {

    var locals = {
      view: 'wikicrawler',
      title: 'circle philosophy'
    };

    res.render('wikicrawler/template', locals);
  },
  getPage: function(req, res, next) {
    var query = url.parse(req.url, true).query;
    getPageData(query.page, function(response){
      res.send(response);
    });
  }
};

var getPageData = function(page, callback){
  wikipedia.page.data(page, { content: true }, function(response) {
    if (response){
      var content = h2p(response.text['*']);
      response.text = '';
      var sentimentRating = sentiment(content);
      response.sentiment = sentimentRating.score;
      callback(response);
    }else{
      getPageData(page);
    }
  });
};
