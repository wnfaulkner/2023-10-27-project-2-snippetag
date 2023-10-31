//SNIPPET CONTROLLER
const Tag = require('../models/tag')
const User = require('../models/user')

module.exports = { 
  new: newSnippet,
  create: createSnippet,
  index: indexSnippet,
  delete: deleteSnippet,
  addTag: addTagToSnippet,
  removeTag: removeTagFromSnippet,
  renderSearchPage: renderSearchPage,
  search: searchSnippets,
}

async function newSnippet(req, res) {
  const tagYearOptions = await Tag.distinct('tagName', {tagParent: 'Year'})
  const tagSectionOptions = await Tag.distinct('tagName', {tagParent: 'Section'})
  const tagClientOptions = await Tag.distinct('tagName', {tagParent: 'Client'})
  const displayMessage = req.session.message ? req.session.message : undefined
  
  res.render(
    'snippets/new', 
    { 
      title: 'Upload & Tag a New Snippet',
      userName: req.user.name,
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
    //console.log(req.user)
    const userName = req.user.name
    const userSnippets = user.snippets
    const tagsAllOptions = await Tag.distinct('tagName')
    const tagYearOptions = await Tag.distinct('tagName', {tagParent: 'Year'})
    const tagSectionOptions = await Tag.distinct('tagName', {tagParent: 'Section'})
    const tagClientOptions = await Tag.distinct('tagName', {tagParent: 'Client'})
    const displayMessage = req.session.message ? req.session.message : false
    //console.log(userSnippets)
    res.render(
      'snippets/edit', 
      { 
        title: 'Edit Snippets',
        displayMessage: displayMessage,
        userName: userName,
        snippets: userSnippets,
        tagsAllOptions: tagsAllOptions.sort(),
        tagYearOptions: tagYearOptions.sort(),
        tagSectionOptions: tagSectionOptions.sort(),
        tagClientOptions: tagClientOptions.sort(),
      }
    );
  } catch(error) {
    console.error('Error rendering Edit page:', error);
    res.status(500).send('Error rendering Edit page');
  }
}

async function deleteSnippet(req, res) {
  try {
    const user = await User.findOne({ 'snippets._id': req.params.id });
    const displayMessage = 'Snippet deleted.'
    //console.log('Delete Function Called!')
    user.snippets.remove(req.params.id)
    await user.save()

    displayMessage = 'Snippet deleted.'

    res.redirect(
      '/snippets/edit',
      {
        displayMessage: displayMessage,
      }
    );
  } catch(error) {
    console.error('Error rendering Edit page:', error);
    res.status(500).send('Error rendering Edit page');
  }
}

async function addTagToSnippet(req, res) {
  //console.log(req.body)
  try{
    const user = await User.findOne({ 'snippets._id': req.params.id });
    const snippet = await user.snippets.id(req.params.id)
    const newTag = await Tag.findOne({ tagName: req.body.newTag });

    if(snippet.tags.includes(newTag._id)){ //guard: if snippet has the selected tag already
      req.session.message = 'You can only add tags once to each snippet. Try adding a tag not already associated with the snippet.';

      res.redirect(
        '/snippets/edit'
      );      
    } else {
      snippet.tags.push(newTag)
      await user.save()
      //console.log(snippet.tags, newTag._id)
      req.session.message = 'Tag Added!'
      res.redirect(
        '/snippets/edit'
      );
    }
  } catch(error) {
    console.error('Error creating snippet:', error);
    res.status(500).send('Error creating snippet');
  }
}

async function removeTagFromSnippet(req, res) {
  try{
    const user = await User.findOne({ googleId: req.user.googleId })
    const snippet = await user.snippets.id(req.params.id)
    const removedTag = await Tag.findById(req.body.tagId)
    
    snippet.tags.remove(removedTag)
    //console.log(req.body, removedTag, snippet.tags)
    await user.save()
    req.session.message = 'Tag Removed!'
    res.redirect(
      '/snippets/edit'
    );
    
  } catch(error) {
    console.error('Error creating snippet:', error)
    res.status(500).send('Error creating snippet')
  }
}

async function renderSearchPage(req, res) {
  try{
    const user = await User.findOne({ googleId: req.user.googleId }).populate({
      path: 'snippets',
      populate: {
        path: 'tags',
        select: 'tagName', // Select only the tagName property
      },
    })
    const userUniqueTags = [];
    user.snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => {
        if (!userUniqueTags.includes(tag.tagName)) {
          userUniqueTags.push(tag.tagName);
        }
      })
    })

    res.render(
      'tags/search', 
      { 
        title: 'Search Snippets',
        snippets: user.snippets,
        userUniqueTags: userUniqueTags.sort(),
        tag: '',
      }
    )
  } catch(error) {
    console.error('Error rendering Search page:', error)
    res.status(500).send('Error rendering Search page')
  }
}

async function searchSnippets(req, res) {
  try {
    //const tagsAllOptions = await Tag.distinct('tagName')
    //const searchedTagId = Tag.findOne({ tagName: req.body.tagName })
    const user = await User.findOne({ googleId: req.user.googleId }).populate({
      path: 'snippets',
      populate: {
        path: 'tags',
        select: 'tagName', // Select only the tagName property
      },
    });
    //const userSnippets = user.snippets
    const snippetsWithSearchedTag = user.snippets.filter(
      (snippet) => {
        return snippet.tags.some((tag) => tag._id.equals(searchedTagId));
      }
    );

    res.redirect(
      'tags/search', 
      { 
        title: 'Search Snippets',
        snippets: snippetsWithSearchedTag,
      }
    )
  } catch {
    console.error('Error rendering Search page:', error)
    res.status(500).send('Error rendering Search page')
  }
}
