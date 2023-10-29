require('dotenv').config();
require('../config/database');

const Tag = require('../models/tag');
const seedTagData = require('./seedTagsData'); // Seed data stored in a separate data.js module

(async function() {

  const removedTags = Tag.deleteMany({}); //Remove existing tags in DB
  let results = await Promise.all([removedTags]);
  console.log('Removed Tags:', results);

  results = await Promise.all([ //Add tags from seedTagData to DB
    Tag.create(seedTagData.tags)
  ]);
  console.log('Created Tags:', results[0]);
  
  process.exit();
})();

