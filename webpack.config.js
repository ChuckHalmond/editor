const path = require("path");
const glob = require("glob");

exports.default = {
    entry: glob.sync("./src/**/*.ts", {ignore: "./src/**/*.d.ts"}).reduce((acc, file) => {
        acc[file.replace(/^\.\/src\//, "")] = file;
        return acc;
      }, {}
    ),
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.svg/,
                type: "asset/inline"
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [
            path.join(__dirname, "./")
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./lib"),
    }
};