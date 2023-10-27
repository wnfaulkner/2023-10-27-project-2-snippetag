const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  snippets: {
    type: Schema.Types.ObjectId,
    ref: 'Snippet',
  }
  // avatar: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);