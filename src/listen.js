import io from 'socket.io-client';
import _ from 'lodash';

import slackRelay from './slackRelay';
import destructureNotification from './destructure-notification';

import conf from './config';

_.forEach(conf, (value) => {
   const socket = io('wss://realtime.dozuki.com');
   const forwardToSlack = slackRelay(value.webhookUrl, value.baseUrl);

   socket.on('connect', () => {
      socket.emit('subscribe', { room: value.socketioRoom });
   });

   socket.on('notification', (notification) => {
      if (notification.event === 'notification') {
         const { text, link } = destructureNotification(notification.html);
         forwardToSlack(link, text);
      }
   });
});
