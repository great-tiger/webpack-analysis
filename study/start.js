function myPlugin() {

}

myPlugin.prototype.apply = function (compiler) {
	/*注意这里的this 就是 new myPlugin() 实例对象 */
	console.log('myPlugin.prototype.apply called');

	/*调用插件的先后顺序*/
	compiler.plugin('entry-option', function (context,entry) {
		/*这里处理entry EntryOptionPlugin中用到了*/
		console.log('1-->>entry-option',context,entry);
	});
	compiler.plugin('after-plugins', function () {
		console.log('2-->>after-plugins');
	});
	compiler.plugin('after-resolvers', function () {
		console.log('3-->>after-resolvers');
	});
	compiler.plugin('environment', function () {
		console.log('4-->>environment');
	});
	compiler.plugin('after-environment', function () {
		console.log('5-->>after-environment');
	});

	compiler.plugin('before-run', function (compiler, callback) {
		console.log('6-->>before-run');
		callback();
	});
	compiler.plugin('run', function (compiler, callback) {
		console.log('7-->>run');
		callback();
	});


	/*开始compile*/
	/*
	 var params = {
	 normalModuleFactory: this.createNormalModuleFactory(),
	 contextModuleFactory: this.createContextModuleFactory()
	 };
	 */
	compiler.plugin('compile', function (params) {
		console.log('8-->>compile');
	});

    /*compile 回调处理完成之后，开始创建compilation实例，
      配置参数后，先后触发this-compilation，compilation
      注意这两个都是同时同步执行的

	 this-compilation compilation实例化后，第一次回调。
	 在这里就可以访问到compilation对象了
    */
	compiler.plugin('this-compilation', function (compilation,params) {
		/*
		 var params = {
			 normalModuleFactory: this.createNormalModuleFactory(),
			 contextModuleFactory: this.createContextModuleFactory()
		 };
		 */
		console.log('9-->>this-compilation');

	});

	/*
	  实质上执行完make插件，就开始执行compilation.seal方法。
	  执行权就交给compilation了。
	  注册compilation插件的时机：
	   this-compilation
	   compilation
	   make
	*/
	compiler.plugin('compilation', function (compilation,params) {
		/*
		 var params = {
		 normalModuleFactory: this.createNormalModuleFactory(),
		 contextModuleFactory: this.createContextModuleFactory()
		 };
		 */
		console.log('10-->>compilation');


		compilation.plugin('seal',function(){
			console.log('       compilation-->>01-->>seal');
		});

		compilation.plugin('optimize',function(){
			console.log('       compilation-->>02-->>optimize');
		});

		compilation.plugin('after-optimize-modules',function(){
			console.log('       compilation-->>03-->>after-optimize-modules');
		});

		compilation.plugin('after-optimize-chunks',function(){
			console.log('       compilation-->>04-->>after-optimize-chunks');
		});

		compilation.plugin('optimize-tree',function(chunks,modules,callback){
			console.log('       compilation-->>05-->>optimize-tree-->>异步(chunks,modules,callback)');
			callback();
		});

		compilation.plugin('after-optimize-tree',function(){
			console.log('       compilation-->>06-->>after-optimize-tree');
		});
	});

	/*注意：make 回调，是并行完成的*/
	compiler.plugin('make',function(compilation,callback){
		console.log('11-->>make');

		callback();
	});


	/****************************************************************/
	/*在这里执行逻辑转入到了compilation中，入口compilation.seal*/
	/*
 	   注册compilation插件，我们可以写到this-compilation,compilation,make
 	*/

	/********************开始compilation执行逻辑***********************/





	/********************结束compilation执行逻辑*******＊***************/

	/*
		在这两者之间，回调compilation.seal方法
	 */
	compiler.plugin('after-compile',function(compilation,callback){
		console.log('12-->>after-compile');
		callback();
	});

	/*

	 if(this.applyPluginsBailResult("should-emit", compilation) === false) {
		 var stats = compilation.getStats();
		 stats.startTime = startTime;
		 stats.endTime = new Date().getTime();
		 this.applyPlugins("done", stats);
		 return callback(null, stats);
	 }

	 通过上面的代码，可以知道，如果第一个should-emit，返回false的话，则直接调用done，结束！
	 */
	compiler.plugin('should-emit', function (compilation) {
		console.log('13-->>should-emit');
	});

	/*emit插件都执行完成后，就开始把compilation.assets写入文件系统*/
	compiler.plugin('emit',function(compilation,callback){
		console.log('14-->>emit');
		callback();
	});

	/*compilation.assets 写入文件完成*/
	compiler.plugin('after-emit',function(compilation,callback){
		console.log('15-->>after-emit');
		callback();
	});

	compiler.plugin('done',function(stat){
		console.log('16-->>done');
	});
};

function FileListPlugin(options) {
}

FileListPlugin.prototype.apply = function (compiler) {


	compiler.plugin('emit', function (compilation, callback) {
		// Create a header string for the generated file:
		var filelist = 'In this build:\n\n';

		// Loop through all compiled assets,
		// adding a new line item for each filename.
		for (var filename in compilation.assets) {
			filelist += ('- ' + filename + '\n');
		}

		// Insert this list into the Webpack build as a new file asset:
		compilation.assets['filelist.md'] = {
			source: function () {
				return filelist;
			},
			size: function () {
				return filelist.length;
			}
		};

		callback();
	});
};


function MyPlugin() {}

MyPlugin.prototype.apply = function(compiler) {
	compiler.plugin('emit', function(compilation, callback) {

		// Explore each chunk (build output):
		compilation.chunks.forEach(function(chunk) {
			// Explore each module within the chunk (built inputs):
			chunk.modules.forEach(function(module) {
				// Explore each source file path that was included into the module:
				module.fileDependencies.forEach(function(filepath) {
					// we've learned a lot about the source structure now...
				});
			});

			// Explore each asset filename generated by the chunk:
			chunk.files.forEach(function(filename) {
				// Get the asset source for each file generated by the chunk:
				var source = compilation.assets[filename].source();
			});
		});

		callback();
	});
};

var webpack = require('../lib/webpack');
var compile = webpack({
	entry: './app/index.js', /*当初，这里直接以app开头，不行啊。必须用.表示从当前目录开始啊*/
	output: {
		path: __dirname + "/public",
		filename: "bundle.js"
	},
	plugins: [
		new myPlugin()
	]
});
/*
 var showHash = d(options.hash, true);
 var showVersion = d(options.version, true);
 var showTimings = d(options.timings, true);
 var showAssets = d(options.assets, true);
 var showChunks = d(options.chunks, true);
*/
compile.run(function (err,stats) {
	process.stdout.write('\n\n\n'+stats.toString({colors:true,hash:true,version:true,timings:true,assets:true,chunks:true}) + "\n");
});

