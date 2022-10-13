import path from "path";
import { Configuration, HotModuleReplacementPlugin, DefinePlugin }  from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import {} from 'webpack-dev-server';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import dotenv from "dotenv";

dotenv.config( {
    path: path.join(__dirname, '.prod.env')
 });

const config: Configuration = {
  mode: "production",
  output: {
    publicPath: "/",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
                "@babel/preset-env",
                ["@babel/typescript", { jsxPragma: "h" }],
              ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, {loader: "css-loader"}],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
        "react": "preact/compat",
        "react-dom": "preact/compat"
      }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
    }),
    new ESLintPlugin({
        extensions: ['ts']
      }),
    new DefinePlugin({ 
        "process.env.BASE_URL_AUTH_SERVICE": JSON.stringify(process.env.BASE_URL_AUTH_SERVICE),
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: false,
};
export default config;