const ScrapedUrl = require('../models/urlModel.js');

async function insertScrapedData(data) {
  console.log('insertScrapedData function triggered!')
  try{  
    const existingUrls = await ScrapedUrl.find({ url: { $in: data.map(item => item.url) } });
        
    // Filter out the data that doesn't already exist in the database
    // maybe redundant due to mongoose unique filter in schema 
    const newData = data.filter(item => !existingUrls.some(url => url === item.url));

    if (newData.length > 0) {
        // Insert only new data
        const insertedData = await ScrapedUrl.insertMany(newData);
        console.log(`Inserted ${insertedData.length} new documents into MongoDB.`);
    } else {
        console.log('All data already exists in the database. No new documents inserted.');
    }
  } catch(error) {
    console.error('Error inserting data:', error);
  }
}




module.exports = {
  insertScrapedData,
};