function myPlugin() {

}

myPlugin.prototype.apply = function (compiler) {
	/*注意这里的this 就是 new myPlugin() 实例对象 */
	console.log('myPlugin.prototype.apply called');

	/*调用插件的先后顺序*/
	compiler.plugin('entry-option', function (context, entry) {
		/*这里处理entry EntryOptionPlugin中用到了*/
		console.log('1-->>entry-option', context, entry);
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
	compiler.plugin('this-compilation', function (compilation, params) {
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
	compiler.plugin('compilation', function (compilation, params) {
		/*
		 var params = {
		 normalModuleFactory: this.createNormalModuleFactory(),
		 contextModuleFactory: this.createContextModuleFactory()
		 };
		 */
		console.log('10-->>compilation');

		var i = 0;


		/**
		 * In the compilation phase, modules are loaded, sealed, optimized, chunked, hashed and restored, etc.
		 * This would be the main lifecycle of any operations of the compilation
		 * 上面说：compilation阶段的生命周期为:
		 * modules are loaded, sealed, optimized, chunked, hashed and restored, etc.
		 */

		compilation.plugin('build-module', function (module) {
			//Before a module build has started.
			console.log('       compilation-->>' + (i++) + '-->>build-module-->>module.request=' + module.request);
		});

		compilation.plugin('succeed-module', function (module) {
			//A module has been built successfully.
			console.log('       compilation-->>' + (i++) + '-->>succeed-module-->>module.request=' + module.request);
		});

		compilation.plugin('failed-module', function (module) {
			console.log('       compilation-->>' + (i++) + '-->>fail-module-->>module.request=' + module.request);
		});

		compilation.plugin('normal-module-loader', function (loaderContext, module) {
			//this is where all the modules are loaded
			//one by one, no dependencies are created yet
			console.log('       compilation-->>' + (i++) + '-->>normal-module-loader-->module.request=' + module.request);
		});

		compilation.plugin('seal', function () {
			//The sealing of the compilation has started. seal阶段开始
			//you are not accepting any more modules
			//no arguments
			console.log('       compilation-->>' + (i++) + '-->>seal');
		});


		compilation.plugin('optimize', function () {
			//webpack is begining the optimization phase
			// no arguments
			//开始优化阶段
			console.log('       compilation-->>' + (i++) + '-->>optimize');
		});


		compilation.plugin('optimize-modules', function (modules) {
			//handle to the modules array during tree optimization
			console.log('       compilation-->>' + (i++) + '-->>optimize-modules-->>同步(modules)');
		});

		compilation.plugin('after-optimize-modules', function (modules) {
			//Optimizing the modules has finished.
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-modules-->>同步(modules)');
		});

		//optimize chunks may be run several times in a compilation
		compilation.plugin('optimize-chunks', function (chunks) {
			//unless you specified multiple entries in your config
			//there's only one chunk at this point
			//这句非常有用，如果在配置文件中，entry只有一个的话，chunk 就只有一个
			console.log('       compilation-->>' + (i++) + '-->>optimize-chunks-->>同步(chunks)');

			chunks.forEach(function (chunk) {
				//chunks have circular references to their modules
				chunk.modules.forEach(function (module) {
					//module.loaders, module.rawRequest, module.dependencies, etc.
				});
			});
		});

		compilation.plugin('after-optimize-chunks', function (chunks) {
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-chunks-->>同步(chunks)');
		});


		compilation.plugin('optimize-tree', function (chunks, modules, callback) {
			console.log('       compilation-->>' + (i++) + '-->>optimize-tree-->>异步(chunks,modules,callback)');
			callback();
		});

		compilation.plugin('after-optimize-tree', function () {
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-tree \n');
		});

		compilation.plugin('revive-modules', function (modules, records) {
			//Restore module info from records.
			console.log('       compilation-->>' + (i++) + '-->>revive-modules-->>同步(modules, records)');
		});

		compilation.plugin('optimize-module-order', function (modules) {
			//Sort the modules in order of importance.
			//The first is the most important module.
			// It will get the smallest id.
			console.log('       compilation-->>' + (i++) + '-->>optimize-module-order-->>同步(modules)');
		});

		compilation.plugin('optimize-module-ids', function (modules) {
			//Optimize the module ids.
			console.log('       compilation-->>' + (i++) + '-->>optimize-module-ids-->>同步(modules)');
		});

		compilation.plugin('after-optimize-module-ids', function (modules) {
			//Optimizing the module ids has finished.
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-module-ids-->>同步(modules)');
		});

		compilation.plugin('record-modules', function (modules, records) {
			//Store module info to the records.
			console.log('       compilation-->>' + (i++) + '-->>record-modules-->>同步(modules,records) \n');
		});


		compilation.plugin('revive-chunks', function (chunks, records) {
			//Restore chunk info from records.
			console.log('       compilation-->>' + (i++) + '-->>revive-chunks-->>同步(chunks,records)');
		});

		compilation.plugin('optimize-chunk-order', function (chunks) {
			//Sort the chunks in order of importance.
			//The first is the most important chunk.
			//It will get the smallest id.
			console.log('       compilation-->>' + (i++) + '-->>optimize-chunk-order-->>同步(chunks)');
		});

		compilation.plugin('optimize-chunk-ids', function (chunks) {
			//Optimize the chunk ids.
			console.log('       compilation-->>' + (i++) + '-->>optimize-chunk-ids-->>同步(chunks)');
		});

		compilation.plugin('after-optimize-chunk-ids', function (chunks) {
			//Optimizing the chunk ids has finished.
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-chunk-ids-->>同步(chunks)');
		});
		compilation.plugin('record-chunks', function (chunks, records) {
			//Store chunk info to the records.
			console.log('       compilation-->>' + (i++) + '-->>record-chunks-->>同步(chunks,records)\n');
		});

		compilation.plugin('before-hash', function () {
			//Before the compilation is hashed.
			console.log('       compilation-->>' + (i++) + '-->>before-hash');
		});

		compilation.plugin('after-hash', function () {
			//After the compilation is hashed.
			console.log('       compilation-->>' + (i++) + '-->>after-hash');
		});

		compilation.plugin('before-chunk-assets', function () {
			//Before creating the chunk assets.  创建assets之前
			console.log('       compilation-->>' + (i++) + '-->>before-chunk-assets');
		});

		compilation.plugin('chunk-asset', function (chunk, filename) {
			//An asset from a chunk was added to the compilation.
			console.log('       compilation-->>' + (i++) + '-->>chunk-asset');
		});

		compilation.plugin('additional-chunk-assets', function (chunks) {
			//Create additional assets for the chunks.
			console.log('       compilation-->>' + (i++) + '-->>additional-chunk-assets');
		});
		compilation.plugin('record', function (compilation, records) {
			//Store info about the compilation to the record
			console.log('       compilation-->>' + (i++) + '-->>record');
		});
		compilation.plugin('optimize-chunk-assets', function (chunks, callback) {
			//Optimize the assets for the chunks.
			console.log('       compilation-->>' + (i++) + '-->>optimize-chunk-assets');
			callback();
		});

		compilation.plugin('after-optimize-chunk-assets', function (chunks) {
			//The chunk assets have been optimized.
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-chunk-assets');
		});

		compilation.plugin('optimize-assets', function (assets, callback) {
			//The assets are stored in this.assets.
			console.log('       compilation-->>' + (i++) + '-->>optimize-assets');
			callback();
		});

		compilation.plugin('after-optimize-assets', function (assets) {
			//The assets has been optimized.
			console.log('       compilation-->>' + (i++) + '-->>after-optimize-assets');
		});

		/*这个没有被调用到*/
		compilation.plugin('module-asset', function (module, filename) {
			//An asset from a module was added to the compilation.
			console.log('       compilation-->>' + (i++) + '-->>module-asset');
		});


	});

	/*
	 注意：make 回调，是并行完成的
	 Plugins can use this point to add entries to the compilation
	 or prefetch modules. They can do this by calling
	 addEntry(context, entry, name, callback)
	 or prefetch(context, dependency, callback) on the Compilation
	 */
	compiler.plugin('make', function (compilation, callback) {
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
	 The compile process is finished and the modules are sealed
	 The next step is to emit the generated stuff.
	 Here modules can use the results in some cool ways.
	 */
	compiler.plugin('after-compile', function (compilation, callback) {
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

	/*
	 emit插件都执行完成后，就开始把compilation.assets写入文件系统
	 The Compiler begins with emitting the generated assets.
	 Here plugins have the last chance to add assets to the c.assets array.
	 */
	compiler.plugin('emit', function (compilation, callback) {
		console.log('14-->>emit');
		callback();
	});

	/*
	 compilation.assets 写入文件完成
	 The Compiler has emitted all assets.
	 */
	compiler.plugin('after-emit', function (compilation, callback) {
		console.log('15-->>after-emit');
		callback();
	});

	compiler.plugin('done', function (stat) {
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


function MyPlugin() {
}
var ConcatSource = require('../node_modules/webpack-sources/lib/ConcatSource.js')
MyPlugin.prototype.apply = function (compiler) {
	compiler.plugin('emit', function (compilation, callback) {

		// Explore each chunk (build output):
		compilation.chunks.forEach(function (chunk) {
			// Explore each module within the chunk (built inputs):
			chunk.modules.forEach(function (module) {
				// Explore each source file path that was included into the module:
				module.fileDependencies.forEach(function (filepath) {
					// we've learned a lot about the source structure now...
				});
			});

			// Explore each asset filename generated by the chunk:
			chunk.files.forEach(function (filename) {
				// Get the asset source for each file generated by the chunk:
				var source = compilation.assets[filename].source();
			});
		});


		callback();
	});

	compiler.plugin('compilation', function (compilation) {
		compilation.plugin("optimize-chunk-assets", function (chunks, callback) {
			chunks.forEach(function (chunk) {
				chunk.files.forEach(function (file) {
					compilation.assets[file] = new ConcatSource("\/**Sweet Banner**\/", "\n", compilation.assets[file]);
				});
			});
			callback();
		});
	})
};


var PrintChunksPlugin = function () {
};
PrintChunksPlugin.prototype.apply = function (compiler) {
	compiler.plugin('compilation', function (compilation, params) {
		compilation.plugin('after-optimize-chunk-assets', function (chunks) {
			console.log(chunks.map(function (c) {
				return {
					id: c.id,
					name: c.name,
					includes: c.modules.map(function (m) {
						//module.request 代表什么含义，从输出上看
						//按照node哪种写法，一个文件就是一个module。
						//猜想request是 module 对应的文件的绝对路径
						return m.request;
					})
				};
			}));
		});
	});
};

var webpack = require('../lib/webpack');
var compile = webpack({
	entry: {
		a: './app/index.js'
	}, /*当初，这里直接以app开头，不行啊。必须用.表示从当前目录开始啊*/
	output: {
		path: __dirname + "/public",
		filename: "[name].bundle.js"
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader:"my-loader"
		}]
	},
	plugins: [
		new myPlugin(),
		//new MyPlugin(),
		//new PrintChunksPlugin()
		//new webpack.optimize.CommonsChunkPlugin('init')
		//new webpack.optimize.OccurrenceOrderPlugin(true)
	]
});
/*
 var showHash = d(options.hash, true);
 var showVersion = d(options.version, true);
 var showTimings = d(options.timings, true);
 var showAssets = d(options.assets, true);
 var showChunks = d(options.chunks, true);
 */
/*官方对这个方法的解释：
 The run method of the Compiler is used to start a compilation.
 This is not called in watch mode.
 */
compile.run(function (err, stats) {
	process.stdout.write('\n\n\n' + stats.toString({
			colors: true,
			hash: true,
			version: true,
			timings: true,
			assets: true,
			chunks: true
		}) + "\n");
});

