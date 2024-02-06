const ScrapedUrl = require('../models/urlModel.js');

const dummyData = [
  { url: 'https://example.com/1', date: new Date(), uploader: 'User1' },
  { url: 'https://example.com/2', date: new Date(), uploader: 'User2' },
  { url: 'https://example.com/3', date: new Date(), uploader: 'User3' },
  // Add more dummy data as needed
];



async function insertScrapedData(data) {
  console.log('insertScrapedData function triggered!')
  try{  
  const insertedData = await ScrapedUrl.insertMany(data);
  console.log(`Inserted ${insertedData.length} documents into MongoDB.`);
  } catch(error) {
    console.error('Error inserting dummy data:', error);
  }
}



module.exports = {
  insertScrapedData,
};