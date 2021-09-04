const path = require("path");

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
  resolve: {
    extensions: [".ts", ".js"],
    modules: [
        path.join(__dirname, "./"),
        path.join(__dirname, "./node_modules")
    ]
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./sample/dist"),
    libraryTarget: "var",
    library: "main"
  }
};