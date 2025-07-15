import { merge } from 'webpack-merge';
import common from './webpack.common';
import { Configuration } from 'webpack';
import CopyPlugin  from 'copy-webpack-plugin';

const prodConfig: Configuration = merge(common, {
   mode: "production",
   plugins: [
    new CopyPlugin({
      patterns: [
        { from: "css", to: "css" },
        { from: "icon.svg", to: "icon.svg" },
        { from: "favicon.ico", to: "favicon.ico" },
        { from: "robots.txt", to: "robots.txt" },
        { from: "icon.png", to: "icon.png" },
        { from: "site.webmanifest", to: "site.webmanifest" }
      ]
    })
  ]
  }
);

export default prodConfig;