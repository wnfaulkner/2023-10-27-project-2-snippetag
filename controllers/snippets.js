//SNIPPET CONTROLLER
const Tag = require('../models/tag')
const User = require('../models/user')

module.exports = { 
  new: newSnippet,
  create: createSnippet,
  index: indexSnippet,
  delete: deleteSnippet,
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
  const displayMessage = req.session.message ? req.session.message : undefined

  res.render(
    'snippets/new', 
    { 
      title: 'Upload & Tag a New Snippet',
      tagYearOptions: tagYearOptions.sort(),
      tagSectionOptions: tagSectionOptions.sort(),
      tagClientOptions: tagClientOptions.sort(),
      message: displayMessage,
    }
  );
}

async function createSnippet(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId })
    const yearTag = await Tag.findOne({tagName: req.body.yearTag})
    const sectionTag = await Tag.findOne({tagName: req.body.sectionTag})
    const clientTag = await Tag.findOne({tagName: req.body.clientTag})
    
    user.snippets.push(
      {
        snippetContent: req.body.snippetContent,
        tags: [yearTag, sectionTag, clientTag]
      }
    )
    await user.save()
    
    req.session.message = 'Snippet successfully saved!';

    res.redirect(
      'snippets/new'
    );
  } catch(error) {
    console.error('Error creating snippet:', error);
    res.status(500).send('Error creating snippet');
  }
}

async function indexSnippet(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId }).populate({
      path: 'snippets',
      populate: {
        path: 'tags',
        select: 'tagName', // Select only the tagName property
      },
    });
    const userName = req.user.name
    const userSnippets = user.snippets
    //console.log(userSnippets)
    res.render(
      'snippets/edit', 
      { 
        title: 'Edit Snippet Tags',
        userName: userName,
        snippets: userSnippets,
      }
    );
  } catch(error) {
    console.error('Error rendering Edit page:', error);
    res.status(500).send('Error rendering Edit page');
  }
}

async function deleteSnippet(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId }).populate('snippets');
    const userName = req.user.name
    const userSnippets = user.snippets
    //console.log(userSnippets)
    user.snippets.remove(req.params.id)
    user.save()
    res.redirect(
      'snippets/edit'
    );
  } catch(error) {
    console.error('Error rendering Edit page:', error);
    res.status(500).send('Error rendering Edit page');
  }
}
