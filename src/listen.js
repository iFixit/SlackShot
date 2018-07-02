import io from 'socket.io-client';
import _ from 'lodash';

import slackRelay from './slackRelay';
import destructureNotification from './destructure-notification';

const conf = [
   {
      socketioRoom: 'ifixit 1101176 99ede35e3baded0cc07c65e78f3b8c2160f9ed0a',
      webhookUrl: 'https://hooks.slack.com/services/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',
   },
   {
      socketioRoom: 'ifixit_meta 1101176 a99201d65c53a579ca0dca6d6af21a418a139405',
      webhookUrl: 'https://hooks.slack.com/services/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',
   },
   {
      socketioRoom: 'ifixit 1883877 d7ab6ec9be763dd3b4d932328430130f3748125a',
      webhookUrl: 'https://hooks.slack.com/services/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',
   },
];

_.forEach(conf, (value) => {
   const socket = io('wss://realtime.dozuki.com');
   const forwardToSlack = slackRelay(value.webhookUrl);

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
