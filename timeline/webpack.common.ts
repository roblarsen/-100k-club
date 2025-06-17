import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  plugins: [
    new HtmlWebpackPlugin({
     template: "./index.html"
   }),
 ],
entry: {
 app: "./scripts/index.ts"
},
resolve: { extensions:  ['.ts', '.tsx', '...']},
module: {
 rules: [
   {
     test: /\.ts$/,
     exclude: [/node_modules/],
     loader: "ts-loader"
   }
 ]
},
output: {
 path: path.resolve("dist"),
 clean: true,
 filename: "./scripts/index.js"
}
};

export default config;
