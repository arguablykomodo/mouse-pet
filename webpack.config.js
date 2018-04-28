const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    inject: "./src/inject.ts",
    popup: "./src/popup.ts"
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: { url: false }
            },
            "sass-loader"
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "**/*",
        context: "src",
        ignore: ["*.ts", "*.scss"]
      }
    ]),
    new ExtractTextPlugin("[name].css")
  ]
};
