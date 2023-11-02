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
  filterSnippets: filterSnippets,
}

async function newSnippet(req, res) {
  try {
    const tagYearOptions = await Tag.distinct('tagName', {tagParent: 'Year'})
    const tagSectionOptions = await Tag.distinct('tagName', {tagParent: 'Section'})
    const tagClientOptions = await Tag.distinct('tagName', {tagParent: 'Client'})
    const displayMessage = req.session.message ? req.session.message : undefined
    
    res.render(
      'snippets/new', 
      { 
        tagYearOptions: tagYearOptions.sort(),
        tagSectionOptions: tagSectionOptions.sort(),
        tagClientOptions: tagClientOptions.sort(),
        displayMessage: displayMessage,
      }
    );
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).send('Error creating snippet');
  }
}

async function createSnippet(req, res) {
  console.log(req.body)
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
  console.log(req.body.filteredSnippets)
  try {
    const tagsAllOptions = await Tag.distinct('tagName')

    const user = await User.findOne({ googleId: req.user.googleId }).populate({
      path: 'snippets',
      populate: {
        path: 'tags',
        select: 'tagName', // Select only the tagName property
      },
    });

    const userUniqueTags = [];
    user.snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => {
        if (!userUniqueTags.includes(tag.tagName)) {
          userUniqueTags.push(tag.tagName);
        }
      })
    })
    console.log(req.body.filteredSnippets)

    let displaySnippets = {}
    if(req.session.filteredSnippets){
      displaySnippets = req.session.filteredSnippets
    } else {
      displaySnippets = user.snippets
    }
    
    const displayMessage = req.session.message !== 'Snippet successfully saved!' ? req.session.message : false
    // console.log(displaySnippets)
    res.render(
      'snippets/edit', 
      { 
        displayMessage: displayMessage,
        snippets: displaySnippets,
        tagsAllOptions: tagsAllOptions.sort(),
        userUniqueTags: userUniqueTags.sort(),
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
   
    user.snippets.remove(req.params.id)
    await user.save()
    
    req.session.message = 'Snippet deleted.'
    req.session.filterSnippets = undefined

    res.redirect(
      '/snippets/edit',
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
      req.session.filteredSnippets = undefined

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
    await user.save()

    req.session.message = 'Tag Removed!'
    req.session.filteredSnippets = req.body.filteredSnippets

    res.redirect(
      '/snippets/edit'
    );
    
  } catch(error) {
    console.error('Error creating snippet:', error)
    res.status(500).send('Error creating snippet')
  }
}

async function filterSnippets(req, res) {
  try{
    const user = await User.findOne({ googleId: req.user.googleId }).populate({
      path: 'snippets',
      populate: {
        path: 'tags',
        select: 'tagName',
      },
    })

    let filteredSnippets = user.snippets
    if(req.query.searchTag){ //filter user.snippets if rendering this page after a search form input (meaning req.quer.searchTag exists)
      filteredSnippets = user.snippets.filter(
        (snippet) => {
          return snippet.tags.some((tag) => tag.tagName === req.query.searchTag);
        }
      );
    }

    req.session.filteredSnippets = filteredSnippets

    res.redirect(
      '/snippets/edit' 
    )
  } catch(error) {
    console.error('Error rendering Search page:', error)
    res.status(500).send('Error rendering Search page')
  }
}
