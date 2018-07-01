module.exports = {
   entry: "./src/listen.js",
   output: {
      filename: "./bundle.js"
   },
   target : 'node',
   optimization: {
      minimize: false
   },
}

