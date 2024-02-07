const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {type: String, unique: true},
  date: Date,
  uploader: String,
}, {
  timestamps: true,
});


const ScrapedUrl = mongoose.model('ScrapedUrl', urlSchema);
module.exports = ScrapedUrl;