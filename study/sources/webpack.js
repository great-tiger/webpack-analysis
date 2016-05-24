/**
 * 可见webpack中最重要的应该是Compiler
 * @param options
 * @returns {Compiler|*}
 */
function webpack(options) {
	var compiler;
	//...... 设置默认参数
	compiler = new Compiler();
	compiler.options = options;
	//下面简述该行代码的作用
	compiler.options = new WebpackOptionsApply().process(options, compiler);

	//单独调用NodeEnvironmentPlugin插件的apply方法
	new NodeEnvironmentPlugin().apply(compiler);
	compiler.applyPlugins("environment");
	compiler.applyPlugins("after-environment");
	return compiler;
}
exports = module.exports = webpack;

//下面的代码用来导出插件


/*
new WebpackOptionsApply().process(options, compiler);

1、调用配置文件中指定插件的apply方法
2、根据配置调用一些内置插件的apply方法


applyPlugins的顺序
 entry-option
 after-plugins
 after-resolvers
 environment
 after-environment
*/