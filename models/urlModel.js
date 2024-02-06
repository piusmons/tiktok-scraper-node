const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: String,
  date: Date,
  uploader: String,
}, {
  timestamps: true,
});


const ScrapedUrl = mongoose.model('ScrapedUrl', urlSchema);
module.exports = ScrapedUrl;