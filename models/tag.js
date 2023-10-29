const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  tagName: String,
  // snippets: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Snippet'
  // }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema);