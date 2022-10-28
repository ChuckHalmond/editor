const path = require("path");
const glob = require("glob");

exports.default = {
    entry: glob.sync("./src/web/**/*.ts", {ignore: "*.d.ts"}).reduce((acc, file) => {
        const filename = file.replace(/^\.\/src\//, "");
        acc[filename.substring(0, filename.lastIndexOf("."))] = file;
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
    experiments: {
        outputModule: true,
    },
    output: {
        library: {
            type: "module"
        },
        filename: "[name].js",
        path: path.resolve(__dirname, "./lib"),
    }
};