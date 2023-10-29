//INDEX CONTROLLER
const User = require('../models/user')

module.exports = {
  index, 
  show
}

function index(req, res) {
  res.render("index", {
    title: ""
  });
}

async function show(req, res) {
  //console.log('Show function called', req.user) 
  res.render(
    'profile', 
    {
      title: 'User Homepage',
    }
  );
}
