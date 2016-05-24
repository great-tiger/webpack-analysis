/*
 Compiler中使用

 new WebpackOptionsApply().process(options, compiler);

 主要是调用插件的apply方法
 apply
 applyPluginsBailResult
 applyPlugins

 按照name从插件库中取出插件调用apply方法
 entry-option
 after-plugins
 after-resolvers

 ???????????????????????????????????????????????????????????????????
 关于一下代码，不明白
 注意：compiler构造函数，已经为resolvers设置了默认值
 compiler.resolvers.normal = ResolverFactory.createResolver(assign({
 resolver: compiler.resolvers.normal
 }, options.resolve));

 */
//为了简化require去掉了
var ResolverFactory = require("enhanced-resolve").ResolverFactory;

function WebpackOptionsApply() {
	OptionsApply.call(this);
}
module.exports = WebpackOptionsApply;

WebpackOptionsApply.prototype = Object.create(OptionsApply.prototype);
WebpackOptionsApply.prototype.process = function(options, compiler) {
	compiler.context = options.context;
	if(options.plugins && Array.isArray(options.plugins)) {
		/*注意第二个apply 是调用的 call,apply 中的apply；作用就是调用插件的apply方法*/
		compiler.apply.apply(compiler, options.plugins);
	}
	compiler.outputPath = options.output.path;
	compiler.recordsInputPath = options.recordsInputPath || options.recordsPath;
	compiler.recordsOutputPath = options.recordsOutputPath || options.recordsPath;
	compiler.name = options.name;
	if(typeof options.target === "string") {
		var JsonpTemplatePlugin;
		var NodeSourcePlugin;
		switch(options.target) {
			case "web":
				JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
				NodeSourcePlugin = require("./node/NodeSourcePlugin");
				compiler.apply(
					new JsonpTemplatePlugin(options.output),
					new FunctionModulePlugin(options.output),
					new NodeSourcePlugin(options.node),
					new LoaderTargetPlugin("web")
				);
				break;
		}
	}
	/*这个插件很重要 细分为 SingleEntryPlugin MultiEntryPlugin*/
	compiler.apply(new EntryOptionPlugin());

	/*applyPluginsBailResult 找出key为name的插件执行插件的apply方法*/
	compiler.applyPluginsBailResult("entry-option", options.context, options.entry);

	compiler.apply(
		new CompatibilityPlugin(),
		new LoaderPlugin(),
		new NodeStuffPlugin(options.node),
		new RequireJsStuffPlugin(),
		new APIPlugin(),
		new ConstPlugin(),
		new UseStrictPlugin(),
		new RequireIncludePlugin(),
		new RequireEnsurePlugin(),
		new RequireContextPlugin(options.resolve.modules, options.resolve.extensions),
		new AMDPlugin(options.module, options.amd || {}),
		new CommonJsPlugin(options.module),
		new HarmonyModulesPlugin(options.module),
		new SystemPlugin(options.module)
	);

	compiler.apply(
		new EnsureChunkConditionsPlugin(),
		new RemoveParentModulesPlugin(),
		new RemoveEmptyChunksPlugin(),
		new MergeDuplicateChunksPlugin(),
		new FlagIncludedChunksPlugin(),
		new OccurrenceOrderPlugin(true),
		new FlagDependencyUsagePlugin()
	);

	compiler.apply(new TemplatedPathPlugin());

	compiler.apply(new RecordIdsPlugin());

	compiler.apply(new WarnCaseSensitiveModulesPlugin());

	if(options.cache === undefined ? options.watch : options.cache) {
		var CachePlugin = require("./CachePlugin");
		compiler.apply(new CachePlugin(typeof options.cache === "object" ? options.cache : null));
	}

	compiler.applyPlugins("after-plugins", compiler);
	compiler.resolvers.normal = ResolverFactory.createResolver(assign({
		resolver: compiler.resolvers.normal
	}, options.resolve));
	compiler.resolvers.context = ResolverFactory.createResolver(assign({
		resolver: compiler.resolvers.context,
		resolveToContext: true
	}, options.resolve));
	compiler.resolvers.loader = ResolverFactory.createResolver(assign({
		resolver: compiler.resolvers.loader
	}, options.resolveLoader));
	compiler.applyPlugins("after-resolvers", compiler);
	return options;
};
