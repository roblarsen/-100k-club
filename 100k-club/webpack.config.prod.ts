import { merge } from 'webpack-merge';
import common from './webpack.common';
import { Configuration } from 'webpack';

const devConfig: Configuration = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
});

export default devConfig;