const puppeteer = require('puppeteer-extra');
require('dotenv').config();
const { parseRelativeTime, generateRandomUserAgent, randomTimeout} = require('./helpers');
const uri = process.env.MONGODB_URI || 'mongodb+srv://piuslchua:itJ8A1rlNvwXa44u@cluster0.tmdmrrf.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const schema = require('mongoose')
const mongoService = require('./mongoService')
const Stealth = require('puppeteer-extra-plugin-stealth');
const ScrapedUrl = require('../models/urlModel.js');
const proxyChain = require('proxy-chain');


async function automateBrowser(query,targetCount, officialAccount) {


  const username = process.env.USERNAME 
  const password = process.env.PASSWORD
  puppeteer.use(Stealth());
  const proxy = '';
  const originalUrl = `http://${username}:${password}@45.88.101.145:5432`;
  const newUrl = await proxyChain.anonymizeProxy(originalUrl);
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--proxy-server=${newUrl}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
    ],
  });
  
  
  
  const pages = await browser.pages();
  const page = pages[0]

  let userAgent = generateRandomUserAgent()
  await page.setUserAgent(userAgent);
  
  await page.setExtraHTTPHeaders({
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
		'accept-encoding': 'gzip, deflate, br', 
		'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
  })
    // search term
  await page.goto('https://www.tiktok.com/', { waitUntil: 'domcontentloaded'});
  
  scrapedData = await scrapeVideoUrls(browser, query, targetCount, officialAccount, page) 
  //*console.log('what is scraped data', scrapedData)
}

async function scrapeVideoUrls(browser, query, targetCount, officialAccount, page ) {
  console.log('launched!')
    await page.waitForTimeout(randomTimeout())

    const currentDate = new Date();
    const extractedData = []
    try { 
      const buttonSelector = '.css-u3m0da-DivBoxContainer';
      const buttonExists = await page.waitForSelector(buttonSelector , { visible: true });
    
      if (buttonExists) {
        await page.mouse.move(200, 400, { steps: 5 });
        await page.waitForTimeout(randomTimeout());
        await page.mouse.move(200, 400, { steps: 5 });
        await page.click(buttonSelector);
      }
        await page.waitForTimeout(randomTimeout());

      const searchBox = await page.$('input[type=search]');
      if (searchBox) {
        await searchBox.type(query, { delay: 223 });
        await page.waitForTimeout(randomTimeout())
        await searchBox.press('Enter');
    } else {
      console.error('Search box not found on the page.proceeding to next action');
      const searchBox = await page.$('input[type=search]');

      if (searchBox) {
        await searchBox.type(query, { delay: 167 });
        await page.waitForTimeout(randomTimeout())
        await searchBox.press('Enter');
      } else {
        console.error('Search box not found on the page.');
      }
    }

    } catch(error) {
      console.error('error', error)
      
    }

    
    const cardDivSelector = '.css-1soki6-DivItemContainerForSearch.e19c29qe10'
    await page.waitForSelector(cardDivSelector);

    while (targetCount < extractedData.length) {

    const div = await page.$$(cardDivSelector)

    const cardDataPromises = div.map(async (divElement) => {
      
      try {
        const url = await divElement.$eval('.css-1as5cen-DivWrapper.e1cg0wnj1 a', node => node.getAttribute('href'));
        const rawDate = await divElement.$eval('.css-dennn6-DivTimeTag.e19c29qe15', node => node.textContent.trim());
        const uploader = await divElement.$eval('.css-2zn17v-PUniqueId.etrd4pu6', node => node.textContent.trim());
        
        let date = parseRelativeTime(rawDate)
        console.log('parsed date', date)
        const daysDifference = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
        console.log('url:', url, 'date:', date, 'uploader:', uploader, 'daysDifference:', daysDifference, 'query', query, 'currentDate', currentDate, 'parsed card date:', date);
        
        if (daysDifference <= 7 && uploader !== officialAccount) {
          return { url, date, uploader };
        } else {
          return null
        }

      } catch (error) {
        console.error('Error extracting data from video card:', error.message);
        return null
      }
    });

    const cardDataArray = await Promise.all(cardDataPromises);
    const filteredCardDataArray = cardDataArray.filter(data => data !== null && data !== undefined);
    extractedData.push(...filteredCardDataArray);
    console.log('what is filteredcarddatarray', filteredCardDataArray)
    mongoService.insertScrapedData(filteredCardDataArray);
    await page.waitForTimeout(randomTimeout())
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000));

  } 

  
    return extractedData
}



module.exports = {
  automateBrowser,
  scrapeVideoUrls,
};