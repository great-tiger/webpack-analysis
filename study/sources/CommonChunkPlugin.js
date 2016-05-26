/*
  这个是简化后的代码
 */
var nextIdent = 0;

function CommonsChunkPlugin(options) {
	this.chunkNames = options.name || options.names;
	this.filenameTemplate = options.filename;
	this.minChunks = options.minChunks;
	this.selectedChunks = options.chunks;
	if (options.children) this.selectedChunks = false;
	this.async = options.async;
	this.minSize = options.minSize;
	this.ident = __filename + (nextIdent++);
}

module.exports = CommonsChunkPlugin;
CommonsChunkPlugin.prototype.apply = function (compiler) {
	var chunkNames = this.chunkNames;
	var filenameTemplate = this.filenameTemplate;
	var minChunks = this.minChunks;
	var selectedChunks = this.selectedChunks;
	var async = this.async;
	var minSize = this.minSize;
	var ident = this.ident;
	compiler.plugin("this-compilation", function (compilation) {
		compilation.plugin(["optimize-chunks", "optimize-extracted-chunks"], function (chunks) {

			//保证优化过程只，执行一次
			//......

			var commonChunks = [];

			//根据名称查找chunk，如果没有找到，就创建一个.最终存入commonChunks.
			//......

			// module.removeChunk(chunk) 需要注意一下这个地方，它也会自动从chunk中移除module
			// usedChunks 将从这几个chunks中，提取公共模块
			// reallyUsedModules 保存的是提取出来的公共的模块
			// 最后将 usedChunks 中的每一个chunk，做为commonChunk的子chunk。
			commonChunks.forEach(function processCommonChunk(commonChunk, idx) {
				var usedChunks;
				usedChunks = chunks.filter(function (chunk) {
					var found = commonChunks.indexOf(chunk);
					/* 假定C,D,F都是entry chunk
					   [A,B,C,D,F]中，要提取公共模块[A,B]
					   此时usedChunks应该为[C,D,F]

					   下面这句，就能保证去掉A,B
					   if (found >= idx) return false;
					 */
					if (found >= idx) return false;
					return chunk.entry;
				});
				var reallyUsedModules = [];
				if (minChunks !== Infinity) {
					var commonModulesCount = [];
					var commonModules = [];
					usedChunks.forEach(function (chunk) {
						chunk.modules.forEach(function (module) {
							var idx = commonModules.indexOf(module);
							if (idx < 0) {
								commonModules.push(module);
								commonModulesCount.push(1);
							} else {
								commonModulesCount[idx]++;
							}
						});
					});
					var _minChunks = (minChunks || Math.max(2, usedChunks.length))
					commonModulesCount.forEach(function (count, idx) {
						var module = commonModules[idx];
						if (typeof minChunks === "function") {
							if (!minChunks(module, count))
								return;
						} else if (count < _minChunks) {
							return;
						}
						reallyUsedModules.push(module);
					});
				}
				var reallyUsedChunks = [];
				reallyUsedModules.forEach(function (module) {
					usedChunks.forEach(function (chunk) {
						if (module.removeChunk(chunk)) {
							if (reallyUsedChunks.indexOf(chunk) < 0)
								reallyUsedChunks.push(chunk);
						}
					});
					commonChunk.addModule(module);
					module.addChunk(commonChunk);
				});

				usedChunks.forEach(function (chunk) {
					chunk.parents = [commonChunk];
					commonChunk.chunks.push(chunk);
					if (chunk.initial)
						commonChunk.initial = true;
					if (chunk.entry) {
						commonChunk.entry = true;
						chunk.entry = false;
					}
				});

			}, this);
			return true;
		});
	});
};

