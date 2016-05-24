# ArrayMap
1、模拟字典 key,value 都可以为object
2、接口：get(key),set(key,value),remove(key),clone()

# NormalModuleFactory
1、继承自Tapable
2、

# SingleEntryPlugin
1、compilation 回调    
设置compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
2、make 回调    
compilation.addEntry(this.context, dep, this.name, callback);

