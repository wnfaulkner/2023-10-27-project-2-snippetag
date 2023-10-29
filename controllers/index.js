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
  // const user = await User.findOne({ __id: req.params.id }) 
  console.log('Show function called',req.user) 
  res.render(
    'profile', 
    {
      title: 'User Homepage',
      //user: user
    }
  );
}
