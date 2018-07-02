import cheerio from 'cheerio';

const destructureNotification = (html) => {
   const notificationHtml = cheerio.load(html);

   const text = notificationHtml('.notification-message').text().trim();
   const link = notificationHtml('a').attr('href');

   return { text, link };
};

export default destructureNotification;
