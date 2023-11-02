//TAGS CONTROLLER
const Tag = require('../models/tag')
const User = require('../models/user')

module.exports = { 
  index: renderTagsTable,
}

async function renderTagsTable(req, res) {
  try {
    const user = await User.findOne({ googleId: req.user.googleId }).populate({
      path: 'snippets',
      populate: {
        path: 'tags',
        select: 'tagName',
      },
    })

    const userUniqueTags = []; //user unique tags
    user.snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => {
        if (!userUniqueTags.includes(tag.tagName)) {
          userUniqueTags.push(tag.tagName);
        }
      })
    })

    // const userTags = user.tags
    console.log(userUniqueTags)
    res.render(
      'tags/index',
      {
        tags: userUniqueTags.sort(),
        displayMessage: undefined,
      }
    )
  } catch(error) {
    console.error('Error rendering Edit page:', error);
    res.status(500).send('Error rendering Edit page');
  }
}
