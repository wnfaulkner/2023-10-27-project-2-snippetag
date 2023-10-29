const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  snippetContent: {type: String, required: true },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  timestamps: true
});

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  snippets: [snippetSchema]
  // avatar: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);