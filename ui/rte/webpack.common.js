const path = require("path");
const dotenv = require("dotenv").config({ path: path.join(__dirname, ".env") });
const webpack = require("webpack");
const pkg = require("./package.json");

// eslint-disable-next-line no-undef
module.exports = {
  entry: path.resolve(__dirname, "src", `${pkg.entry}.tsx`),
  externals: {
    react: "react",
    reactDom: "react-dom",
    "@contentstack/venus-components": "@contentstack/venus-components",
  },
  mode: "production",
  output: {
    filename: pkg.output,
    path: path.resolve(__dirname, "../build/dist"),
    libraryTarget: "system",
  },
  module: {
    rules: [
      {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [/node_modules/, /build/, /__test__/],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // 3. Inject styles into DOM
          "css-loader", // 2. Turns css into commonjs
          "sass-loader", // 1. Turns sass into css
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
  ],
};
