const path = require("path");

module.exports = {
  entry: ["@babel/polyfill", "./src/ClientJS/index.js"],
  output: {
    path: path.resolve(__dirname, "public", "js"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /index.js/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // add @babel/preset-env instead of env
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    publicPath: "/js/",
  },
  devtool: "source-map",
};
