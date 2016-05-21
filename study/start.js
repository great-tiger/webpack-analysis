function myPlugin(){

}

myPlugin.prototype.apply=function(compiler){
	/*注意这里的this 就是 new myPlugin() 实例对象 */
	console.log('myPlugin.prototype.apply called');

	/*调用插件的先后顺序*/
	compiler.plugin('entry-option', function() {
		console.log('1-->>entry-option');
	});
	compiler.plugin('after-plugins', function() {
		console.log('2-->>after-plugins');
	});
	compiler.plugin('after-resolvers', function() {
		console.log('3-->>after-resolvers');
	});
	compiler.plugin('environment', function() {
		console.log('4-->>environment');
	});
	compiler.plugin('after-environment', function() {
		console.log('5-->>after-environment');
	});

	compiler.plugin("compilation", function(compilation) {
		console.log('myPlugin-->>compilation');
	});

	compiler.plugin("emit", function(compilation) {
		console.log('myPlugin-->>emit');
	});
};

function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
	compiler.plugin('emit', function(compilation, callback) {
		// Create a header string for the generated file:
		var filelist = 'In this build:\n\n';

		// Loop through all compiled assets,
		// adding a new line item for each filename.
		for (var filename in compilation.assets) {
			filelist += ('- '+ filename +'\n');
		}

		// Insert this list into the Webpack build as a new file asset:
		compilation.assets['filelist.md'] = {
			source: function() {
				return filelist;
			},
			size: function() {
				return filelist.length;
			}
		};

		callback();
	});
};

var webpack=require('../lib/webpack');
var compile=webpack({
	entry:'./app/index.js',/*当初，这里直接以app开头，不行啊。必须用.表示从当前目录开始啊*/
	output: {
		path: __dirname + "/public",
		filename: "bundle.js"
	},
	plugins:[
		new FileListPlugin()
	]
});

compile.run(function(err){
	console.log('err',err);
});

