import { merge } from 'webpack-merge';
import common from './webpack.common';
import { Configuration } from 'webpack';
import CopyPlugin from "copy-webpack-plugin";

const prodConfig: Configuration = merge(common, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "img", to: "img" },
        { from: "css", to: "css" },
      ]
    })
  ]
});

export default prodConfig;
