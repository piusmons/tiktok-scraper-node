
require('dotenv').config();
const { parseRelativeTime} = require('./helpers');
const mongoose = require('mongoose');
const puppeteerService = require('./services/puppeteerService');
const mongoService = require('./services/mongoService')


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected to mongodb")
  } catch (error) {
    console.log(error);
  }
}
    

connect()
puppeteerService.automateBrowser("#papaplatte",5,"papaplatte"); 



