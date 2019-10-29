const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const path = require('path')

const PUBLIC_PATH = '/'

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'

  return {
    mode: mode || 'development',
    entry: {
      index: './src/index.js'
    },
    output: {
      path: path.join(__dirname, '../chaincart-server/public'),
      filename: '[name].bundle.js',
      publicPath: PUBLIC_PATH
    },
    resolve: {
      alias: {
        "react": "preact/compat",
        "react-dom": "preact/compat"
      }
    },
    module: {
      rules: [
        {
          use: 'babel-loader',
          test: /\.jsx?$/,
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    optimization: {
      minimize: false//mode === 'production'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '/templates/index.html'),
        chunks: ['index'],
        hash: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      })
    ],
    devServer: {
      // historyApiFallback: true,
      disableHostCheck: true,
      port: 3000
    }
  }
}
