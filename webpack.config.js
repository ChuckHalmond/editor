const path = require("path");
const webpack = require('webpack');

exports.default = {
  entry: "./sample/main.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/]
    })
  ],
  resolve: {
    extensions: [".ts", ".js"],
    modules: [
      path.join(__dirname, "./")
    ]
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./sample/dist"),
    library: {
      name: "main",
      type: "var",
    },
  }
};