const puppeteer = require('puppeteer-extra');
require('dotenv').config();
const { parseRelativeTime} = require('./helpers');
const { MongoClient } = require('mongodb');

const Stealth = require('puppeteer-extra-plugin-stealth');

const uri=process.env.MONGODB_URI
mongoClient = new MongoClient(uri);


async function connectToCluster(uri) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }

  
}

async function automateBrowser(query) {
  // Launch the browser and open a new blank page
  puppeteer.use(Stealth());

  const browser = await puppeteer.launch({
    devtools: true, 
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--window-size=1920,1080',
      '--proxy-server=brd.superproxy.io:22225'   
    ],
          defaultViewport: {
            width:1920,
            height:1080
          }
  });
  
  let targetCount = 100
  scrapedData = await scrapeVideoUrls(browser, query, targetCount)
  console.log('what is scraped data', scrapedData)

}

async function scrapeVideoUrls(browser, query, targetCount ) {
  console.log('launched!')
  const username = process.env.PUPPETEER_USERNAME;
  const password = process.env.PUPPETEER_PASSWORD;
  const host = process.env.PUPPETEER_HOST;

  const page = await browser.newPage();
  await page.authenticate({
      username: username,
      password: password,
      host: host
    })
  await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  const currentDate = new Date();
  const extractedData = []

  
    // search term
    await page.goto('http://tiktok.com/', { waitUntil: 'domcontentloaded'});
  
    try { 
      const btnSelector = '.css-txolmk-DivGuestModeContainer.exd0a435';
      const buttonExists = await page.waitForSelector(btnSelector);
      if (buttonExists) {
        await page.waitForTimeout(2100);
        await page.mouse.move(200, 400, { steps: 5 });
        await page.click(btnSelector);
      }
        await page.waitForTimeout(2100);

      const searchBox = await page.$('input[type=search]');
      if (searchBox) {
        await searchBox.type(query, { delay: 223 });
        await page.waitForTimeout(610);
        await searchBox.press('Enter');
    } else {
      console.error('Search box not found on the page.');
    }

    } catch {
      console.error('button did not appear! proceeding to next action')
      const searchBox = await page.$('input[type=search]');

      if (searchBox) {
        await searchBox.type(query, { delay: 167 });
        await page.waitForTimeout(610);
        await searchBox.press('Enter');
      } else {
        console.error('Search box not found on the page.');
      }

    }

  
    const cardDivSelector = '.css-1soki6-DivItemContainerForSearch.e19c29qe10'
    await page.waitForSelector(cardDivSelector);
    while (targetCount > extractedData.length) {

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
        const cleanedQuery = query.replace(/^#/, ''); // Remove hashtag
        if (daysDifference <= 7 && uploader !== cleanedQuery) {
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
    
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);

    await new Promise((resolve) => setTimeout(resolve, 5000))
  } 

  
    return extractedData
}
    

async function testScraperStealth() {


}

connectToCluster(uri);
/* automateBrowser("#papaplatte"); */
