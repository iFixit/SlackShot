import request from 'request';
import io from 'socket.io-client';
import cheerio from 'cheerio';

// const ifixitSocket = io('wss://realtime.dozuki.com');
// const metaSocket = io('wss://realtime.dozuki.com');

const iFixitSocketioRoom = 'ifixit 1101176 99ede35e3baded0cc07c65e78f3b8c2160f9ed0a';
const MetaSocketioRoom = 'ifixit_meta 1101176 a99201d65c53a579ca0dca6d6af21a418a139405';

const onError = (err, res, body) => {
   if (res !== 200) {
      console.log('REQUEST RESULTS:', err, body);
   }
};

const forwardToSlack = (url, text) => {
   let formattedString;

   if (url) {
      const completeUrl = `http://www.ifixit.com${url}`;
      formattedString = `<${completeUrl}|${text}>`;
   } else {
      formattedString = text;
   }


   const uri = 'https://hooks.slack.com/services/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';
   const headers = { 'Content-type': 'application/json' };
   const body = `{"text":"  ${formattedString} "}`;

   const options = {
      uri,
      headers,
      body,
   };

   request.post(options, onError);
};

const socket = io('wss://realtime.dozuki.com');

socket.on('connect', () => {
   socket.emit('subscribe', { room: iFixitSocketioRoom });
   socket.emit('subscribe', { room: MetaSocketioRoom });
});

socket.on('notification', (notification) => {
   if (notification.event !== 'notification') return;

   const notificationHtml = cheerio.load(notification.html);

   const text = notificationHtml('.notification-message').text().trim();
   const link = notificationHtml('a').attr('href');

   forwardToSlack(link, text);
});
