import path from 'path';
import webpack from 'webpack';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import LodashWebpackPlugin from 'lodash-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    context: process.cwd(),

    devtool: 'cheap-module-eval-sourcemap',

    entry: {
        'widget': ['react-hot-loader/patch', 'webpack-hot-middleware/client', './src/widget/index.jsx'],
        'index': ['webpack-hot-middleware/client', './src/index.js'],
    },

    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js',
        path: path.resolve('dist'),
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextWebpackPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' }),
                include: /node_modules/,
            },
            {
                test: /\.scss$/,
                loader: ExtractTextWebpackPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?sourceMap&importLoaders=3!postcss-loader!resolve-url-loader!sass-loader?sourceMap',
                }),
                exclude: /node_modules/,
            },
            { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.pegjs$/, loader: 'pegjs-loader' },
            { test: /\.(png|jpeg|jpg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000' },
            { test: /\.(eot|ttf|wav|mp3|otf)$/, loader: 'file-loader' },
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.resolve('src'), path.resolve('node_modules')]
    },

    plugins: [
        new LodashWebpackPlugin(),
        new webpack.LoaderOptionsPlugin({
			minimize: false,
			debug: true,
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
        new HtmlWebpackPlugin({
            filename: 'articles.html',
            chunks: ['common', 'widget'],
            template: 'src/widget/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['common', 'index'],
            template: 'src/index.html'
        }),
		new ExtractTextWebpackPlugin('[name].[chunkhash].css'),
        new CopyWebpackPlugin([
            { from: './src/yhack-logo-thickstroke.png', to: 'yhack-logo-thickstroke.png' },
            { from: './src/mag-glass-hndl.png', to: 'mag-glass-hndl.png' }
        ])
    ],
}
