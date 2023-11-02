//INDEX CONTROLLER
const User = require('../models/user')

module.exports = {
  index, 
  show,
}

function index(req, res) {
  
  res.render(
    "index", 
    {
      title: "",
    }
  );
}

async function show(req, res) {
  const userName = req.user.name
  res.render(
    'profile', 
    {
      title: `${userName}'s Homepage`,
      userName: userName,
    }
  );
}
