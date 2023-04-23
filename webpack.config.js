const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devServer = (isDev) => !isDev ? {} : {
    devServer: {
        open: true,
        hot: true,
        port: 8080,
    }
};

const pages = ["index", "ui"];

module.exports = ({ develop }) => ({
    mode: develop ? 'development' : 'production',
    devtool: 'source-map',
    //entry: './src/index.js',
    entry: pages.reduce((config, page) => {
        config[page] = `./src/${page}.js`;
        return config;
      }, {}),
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        //filename: 'bundle.js',
        filename: "[name].js",
        assetModuleFilename: 'images/[name][ext][query]',
        clean: true,
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './src/index.html'
    //     }),
    //     new MiniCssExtractPlugin({
    //         filename: './styles/_0root.css'
    //     }),
    //     new CleanWebpackPlugin()
    // ],
    plugins: [].concat(
        pages.map(
          (page) =>
            new HtmlWebpackPlugin({
              inject: true,
              template: `./src/${page}.html`,
              filename: `${page}.html`,
              chunks: [page],
            })
        ),
        new MiniCssExtractPlugin({
            filename: './styles/00_root.css'
        }),
        new CleanWebpackPlugin()
    ),    
    module: {
        rules: [
            {
                test: /\.(?:ico|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                ]
            }
        ]
    },
    ...devServer(develop)
});
