const path = require('path');

module.exports = {
  entry: {
    app: './scripts/main.ts',
  },
  resolve: {  extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
    {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
    }
  ],
},
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './scripts/main.js',
  },
};
