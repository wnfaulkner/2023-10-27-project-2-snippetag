const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  tagName: String,
  tagParent: {type: String, enum: ['Year', 'Client', 'Section']}
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema);