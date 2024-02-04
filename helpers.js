


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
