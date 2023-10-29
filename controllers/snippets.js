//SNIPPET CONTROLLER
const Tag = require('../models/tag')

module.exports = { 
  new: newSnippet,
  create: createSnippet,
  edit: editSnippet,
}

// function index(req, res) {
//   res.render("index", {
//     title: "Homepage"
//   });
// }

async function newSnippet(req, res) {
  const tagYearOptions = await Tag.distinct('tagName', {tagParent: 'Year'})
  const tagSectionOptions = await Tag.distinct('tagName', {tagParent: 'Section'})
  const tagClientOptions = await Tag.distinct('tagName', {tagParent: 'Client'})
  res.render(
    'snippets/new', 
    { 
      title: 'Upload & Tag a New Snippet',
      tagYearOptions: tagYearOptions.sort(),
      tagSectionOptions: tagSectionOptions.sort(),
      tagClientOptions: tagClientOptions.sort(),
    }
  );
}

async function createSnippet(req, res) {
  try {
    await Snippet.create(
      {
        snippetContent: req.body.snippetContent,
        tags.push
      }
    )
    console.log(req.body)
    res.redirect(
      'snippets/new' 
      // { 
      //   title: 'Upload & Tag a New Snippet',
      //   tagYearOptions: tagYearOptions.sort(),
      //   tagSectionOptions: tagSectionOptions.sort(),
      //   tagClientOptions: tagClientOptions.sort(),
      //   justCreatedNewSnippet: true,
      // }
    );
    console.log('Snippet Created!')
  } catch {
    //console.log(err)
  }
}


function editSnippet(req, res) {
  //console.log(req.params)
  res.render('snippets/edit', { title: 'Edit Snippet Tags'});
}
