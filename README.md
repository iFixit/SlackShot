# SlackShot

Summary
---
This is a tool for forwarding dozuki realtime notifications to Slack. 

To build: 

```
npm run build
```

To run:

```
node dist/bundle.js
```

However, I recommend running bundle.js as a daemon using a tool like forever or pm2:

```
forever start dist/bundle.js
```

Usage
---
Simply replace the config options with the desired options for your user. You
can grab the `socketioRoom` App variable from `App.socketioRoom` at your
respective dozuki site. Webhook urls can be generated at the slack site:
https://api.slack.com/apps.

0) Copy config.example.js to config.js
1) Create a new app
2) Enable incoming webhooks 
3) Add new webhook to workspace
3a) Add permission to Post to yourself
4) Copy webhook URL to this config.js
5) Visit your dozuki homepage
6) Open your devtools and grab `App.socketioRoom`. Insert the variable into your config
7) Make your 'baseUrl' to the Url of your Dozuki homepage (no trailing slash)

How It Works
---
This app has three main stages: Listen, format, forward.

### 1) Listen

It opens a websocket connection to the dozuki RTN server (wss://realtime.dozuki.com). On connection it emits a subscribe message to the socketio rooms specified in the config

### 2) Format

Right now, the Dozuki RTN server serves HTML. The hackiest part of this app extracts the notification text and link from the HTML. This all happens in `/src/destructure-notification.js`. The function takes the notification html and returns a `{ text, link }` object.

### 3) Forward

After we have the notification text and url (optional), we use request to curl the slack webhook with our payload.
