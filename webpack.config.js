module.exports = {
   entry: './src/main.js',
   output: { filename: './bundle.js' },
   target: 'node',
   optimization: { minimize: false },
   mode: 'development',
   watch: true,
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['babel-preset-env'],
               },
            },
         },
      ],
   },
};
