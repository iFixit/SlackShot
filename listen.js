var io = require('socket.io-client');
var request = require('request');
var jsdom = require('node-jsdom');

var socket = io("wss://realtime.dozuki.com");

socket.on('connect', function() {
   console.log("Connected");
   iFixitSocketioRoom = 'ifixit 1101176 99ede35e3baded0cc07c65e78f3b8c2160f9ed0a';
   iFixitMetaSocketioRoom = 'ifixit_meta 1101176 a9901d65c53a579ca0dca6d6af21a418a139405';
   socket.emit('subscribe', { room: iFixitSocketioRoom });
   socket.emit('subscribe', { room: iFixitMetaSocketioRoom });
});

socket.on('notification', function(notification) {
   if (notification['event'] != 'notification') return;
   console.log("Recieved notification:\n" + (notification["html"]));
   console.log("Whole notification: \n " + JSON.stringify(notification));
   
   jsdom.env(notification["html"], ["http://code.jquery.com/jquery.js"], function (errors, window) {
      msg = window.$("div.notification-message").text().trim();
      lnk = window.$("a").attr("href");

      var headers = { 'Content-type': 'application/json' };

      if (lnk) {
         lnk = "http://www.ifixit.com" + lnk;
         var formattedString = "<" + lnk + "|" + msg + ">";
      } else {
         var formattedString = msg;
      }
      var dataString = '{"text":"' + formattedString + ' "}';

      var options = {
         url: 'https://hooks.slack.com/services/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',
         method: 'POST',
         headers: headers,
         body: dataString
      };

      function callback(error, response, body) {
         if (!error && response.statusCode == 200) {
            console.log(body);
         }
      }
      request(options, callback);
   });
});
