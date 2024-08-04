
require('dotenv').config();
const mongoose = require('mongoose');
const puppeteerService = require('./services/puppeteerService');


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected to mongodb")
  } catch (error) {
    console.log(error);
  }
}
    

//Testing Comment


connect()
puppeteerService.automateBrowser("#papaplatte",5,"papaplatte"); 
