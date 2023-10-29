//TAGS CONTROLLER

module.exports = { 
  search: searchTag
}

// function index(req, res) {
//   res.render("index", {
//     title: "Homepage"
//   });
// }

function searchTag(req, res) {
  //console.log(req.params)
  res.render('tags/search', { title: 'Search Snippets by Tag'});
}
