# Vue 插件化
Vue插件化的定义？

Vue项目是一个有大量组件组合成的树形集合。每个单一的组件是整个应用视图中的一个单一的视图层。

Vue或类似前端框架对web应用的拆分有mvvm、mvi、mvc等等模式。就是把web应用竖向和横向分层，竖向大致是

    view
    ---------
    controller
    ----------
    model
    
    
横向是每个小功能模块。（当然其中每一层又可以再拆分基础和业务逻辑）  


当遇到VUE项目比较庞大、或者希望提供扩展等等场景的时候我们期望有一种类似postcss，或者webpack插件这样的
机制。可以对标准的功能进行拦截、管道流式处理。

# VUE插件化功能点
依照上面的阐述。我们可以归纳出VUE Plugin 主要包含两部分：
    
    1.Selector
    2.Interceptor
    
## Selector
筛选希望拦截的组件


## Interceptor
对筛选到的组件进行拦截处理。    



