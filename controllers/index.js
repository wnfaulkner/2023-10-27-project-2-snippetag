//INDEX CONTROLLER
const User = require('../models/user')

module.exports = {
  index, 
  show, 
  requestDeleteUser: requestDeleteUser,
  confirmDeleteUser: confirmDeleteUser,
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

function requestDeleteUser(req, res) {
  // console.log('REQUEST DELETE USER FUNCTION CALLED')
  res.render(
    'delete-user',
    {userId: req.user.id}
  )
}

async function confirmDeleteUser(req, res) {
  try {
    const user = await User.findById(req.user.id)
    console.log(user)
    await User.deleteOne({ _id: req.user.id })
    res.redirect('/logout')
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user.');
  }
}
