/* eslint-disable */
const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const pkg = require("./package.json");

// eslint-disable-next-line no-undef
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  devServer: {
    static: path.join(__dirname, "../build/dist"),
    // https: true,
    port: 1268,
    compress: true,
    hot: false,
    host: "localhost",
    allowedHosts: "all",
    open: {
      target: `/${pkg.output}`,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
