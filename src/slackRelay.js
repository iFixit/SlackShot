import request from 'request';

const onError = (err, res, body) => {
   if (res !== 200) {
      console.log('REQUEST RESULTS:', err, res, body);
   }
};

export default function forwardToSlack(slackHook, baseUrl) {
   return (url, text) => {
      let formattedString;

      if (url) {
         const completeUrl = `${baseUrl}${url}`;
         formattedString = `<${completeUrl}|${text}>`;
      } else {
         formattedString = text;
      }

      const uri = slackHook;
      const headers = { 'Content-type': 'application/json' };
      const body = `{"text":"  ${formattedString} "}`;

      const options = {
         uri,
         headers,
         body,
      };

      request.post(options, onError);
   };
}
