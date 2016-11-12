const express = require('express');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');

require('babel-register');

const port = process.env.PORT || 8000;

const app = express();

const config = require('./webpack.config.babel').default;

const compiler = webpack(config);
compiler.apply(new DashboardPlugin());

const middleware = devMiddleware(compiler, {
    publicPath: config.output.publicPath,
});

app.use(middleware);
app.use(hotMiddleware(compiler));

app.listen(port, (err) => {
	if (err) {
		console.error(err.message);
		return;
	}
	console.log(`App started on http://localhost:${port}`);
});
