const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  snippetContent: String,
  tags: {
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Snippet', snippetSchema);