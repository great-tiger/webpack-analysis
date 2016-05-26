var webpack=require('../lib/webpack');
module.exports={
	entry: {
		a: './app/index.js'
	}, /*当初，这里直接以app开头，不行啊。必须用.表示从当前目录开始啊*/
	output: {
		path: __dirname + "/public",
		filename: "[name].bundle.js"
	},
	plugins: [
		//new myPlugin(),
		//new MyPlugin(),
		//new PrintChunksPlugin()
		//new webpack.optimize.CommonsChunkPlugin('init')
		//new webpack.NoErrorsPlugin()
		//new webpack.ProgressPlugin(function handler(percentage, msg) {
		//	console.log("percentage",percentage);
		//})
	]
};