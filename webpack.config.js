const path = require('path');

module.exports = {
    entry: './src/index.js', // or your JS file
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        // no need for a special rule for JSON
      ],
    },
    resolve: {
      extensions: ['.js', '.json'], // optional, .json is included by default
    },
  mode: 'production'
};