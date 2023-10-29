//SNIPPET CONTROLLER
const Tag = require('../models/tag')
const User = require('../models/user')

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
    const user = User.findById(req.params.id)
    await user.snippets.push(
      {
        snippetContent: req.body.snippetContent
      }
    )
    console.log(req.body.snippetContent)
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
  } catch(error) {
    console.error('Error creating snippet:', error);
    res.status(500).send('Error creating snippet');
  }
}


function editSnippet(req, res) {
  //console.log(req.params)
  res.render('snippets/edit', { title: 'Edit Snippet Tags'});
}
