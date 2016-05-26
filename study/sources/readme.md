# ArrayMap
1.模拟字典 key,value 都可以为object     
2.接口：get(key),set(key,value),remove(key),clone()     

# NormalModuleFactory
1.继承自Tapable       

# SingleEntryPlugin
1.compilation 回调    
设置compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);   
2.make 回调    
compilation.addEntry(this.context, dep, this.name, callback);    

# Compilation
1.这个类继承自Tapable
2.重要属性说明
  chunks 所有chunk   
  namedChunks 命名chunk,就是有名字的。 chunk 就是Chunk类的实例 new Chunk(name, module, loc)   

# Chunk
1.这个类不继承其它任何类
2. 重要属性说明
   name = name; chunk 名字   
   modules = []; chunks 包含的modules   
   parents = []; 所属chunk，说明一个chunk，可以有多个父亲   
   files = [];chunk要生成的文件？   
   entry = false; 是否是entry chunk   
   initial = false; 是不是initial chunk  

# OccurrenceOrderPlugin
1.注册 optimize-module-order 插件 ，对modules进行排序
2.注册 optimize-chunk-order  插件 ，对chunks进行排序
3.具体排序规则，待具体研究  

# NoErrorsPlugin
1.注册 should-emit should-record 回调，如果存在错误，则跳过emitting阶段和recording阶段       
2.如果有错误的话，将不会有assets被emitted. 我测试的结果是，没有assets文件被生成       
3.If you are using the CLI, the webpack process will not exit with an error code by enabling this plugin            
通过使用这个插件，webpack进程就不会因为一个错误退出了;       
关于这种说法，没有能够证实。我用webpack --watch.无论是不是使用这个插件，遇到错误，都不会退出啊。      





