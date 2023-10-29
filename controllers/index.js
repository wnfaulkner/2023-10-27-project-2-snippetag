//INDEX CONTROLLER

module.exports = {
  index, 
  show
}

function index(req, res) {
  res.render("index", {
    title: "Homepage"
  });
}

function show(req, res) {
  res.render('users', { title: 'User Homepage'});
}
