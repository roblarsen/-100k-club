import { merge } from 'webpack-merge';
import  config  from './webpack.common';
import { Configuration } from 'webpack';
import * as devServer from 'webpack-dev-server';

const devConfig: Configuration = merge(config, {
  mode: 'development',
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
});

export default devConfig;