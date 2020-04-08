//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
	target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

	entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
	output: {
		// the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
		path: path.resolve(__dirname, 'dist'),
		filename: 'extension.js',
		libraryTarget: 'commonjs2',
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
	devtool: 'source-map',
	devtool: 'nosources-source-map',
	externals: { vscode: 'commonjs vscode' }, // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
	resolve: { extensions: ['.ts', '.js'] },// support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
	module: { rules: [{ test: /\.ts$/, exclude: /node_modules/, use: [{ loader: 'ts-loader', options: { transpileOnly: true, } }] }] },
	optimization: {
		minimizer: [(compiler) => {
			const TerserPlugin = require('terser-webpack-plugin');
			new TerserPlugin({
				cache: true, parallel: true, sourceMap: true,
				terserOptions: {
					compress: { booleans_as_integers: true, drop_console: true, passes: 2, toplevel: true, },
					toplevel: true,
					mangle: { eval: true, toplevel: true, properties: {} }
				}
			}).apply(compiler);
		}]
	}
};
module.exports = config;
/*
default 11292
my new 9301
*/