module.exports = function(req, res, next) {

  var locals = {
    view: 'index',
    title: 'Express'
  };

  res.render('index/template', locals);
};
