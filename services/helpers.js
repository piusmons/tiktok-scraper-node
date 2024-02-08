


exports.parseRelativeTime = function(rawDate) {
  const now = new Date();
  
  if (rawDate.includes('h ago')) {
    //checks if is in the format ex. 5h ago
    const hoursAgo = parseInt(rawDate, 10);
    return new Date(now - hoursAgo * 60 * 60 * 1000);
  } else if (/^\d{1,2}\/\d{1,2}$/.test(rawDate)) {
    // Check if rawDate is in this example format '1/25'
    const [month, day] = rawDate.split('/').map(Number);
    const currentYear = now.getFullYear();
    return new Date(currentYear, month - 1, day); // Month is 0-based in JavaScript Date
  } else {
    return new Date(rawDate);
  }
  
}

exports.generateRandomUserAgent = function() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
  ];
  const randomUAIndex = Math.floor(Math.random() * userAgents.length);
  
  return userAgents[randomUAIndex];

}

exports.generateRandomProxy = function() {
  const proxies = [
    '31.204.3.39:5432',
    '45.88.101.94:5432',
    '89.19.33.38:5432',
    '91.108.193.243:5432',
    '176.118.37.106:5432',
  ];
  const randomProxy = Math.floor(Math.random() * proxies.length);

  return proxies[randomProxy]
}

exports.randomTimeout= function() {
  return Math.floor(Math.random() * 4000) + 1000; 
}