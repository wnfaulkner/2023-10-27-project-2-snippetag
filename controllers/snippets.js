//SNIPPET CONTROLLER

module.exports = { 
  new: newSnippet
}

// function index(req, res) {
//   res.render("index", {
//     title: "Homepage"
//   });
// }

function newSnippet(req, res) {
  console.log(req.params)
  res.render('snippets/new', { title: 'Upload & Tag a New Snippet'});
}
