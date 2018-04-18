#组件重载  

## 第一步：写一个"不太一样"的Vue组件
插件系统会在匹配组件的INIT阶段根据匹配到的对应配置项重载标版组件的组件声明。然后，标版组件就会根据新的配置项进入创建渲染响应。
插件系统内置了对Vue配置项95%的覆盖重载。
```
import template from 'path/to/template.html' // 需要先拿到被重载的组件模板的内容，然后进行修改
import Acomp from 'path/to/Acomp'

export default {
  template,
  data (data) {
    Object.assign(data, { firstName: 'zhang', lastName: 'san' })
    return data
  },
  computed: {
    name: function () {
      return this.firstName + this.lastName
    }
  },
  watch: {
    name (now) {
      console.log(now, 'different tab')
    }
  },
  components: {
    Acomp
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  filters: {
    format: function (str) {
      return formatStr(str)
    }
  },
  methods: {
    walk () {
      console.log('覆盖walk方法')
    },
    $run () {
      console.log('前置拦截run方法')
    },
    $fly$ () {
      console.log('前置并后置拦截fly方法')
    }
  },
  created: function () {

  },
  mounted: function () {

  }
}
```

### data的重载
把标版组件的data方法的结果值传入重载的data方法，可以在这里对data进行添加新属性的操作。
```
data (data) {
  data.newAttribute = '新属性定义'
  return data
}
```       

### methods的重载
方法的重载比较多样化，支持AOP编程模式。可以新增method，也可以覆盖标版method，也可以在标版方法的前面和后面调用重载方法。
```
methods: {
  walk (arg) {
    console.log('覆盖walk方法')
    return arg
  },
  $run (arg) {
    console.log('前置拦截run方法')
    return arg
  },
  $fly$ (arg) {
    console.log('前置并后置拦截fly方法')
    return arg
  }
}
```
    
方法的重载针对标版的方法的返回值也可以根据情况做处理。
>需要注意的是重载方法对参数做处理的时候，要注意保证参数结构的完整性，防止标版方法因为参数结构变化产生异常！！！
    
                
### 扩展配置项
对vue的如下几个配置项
```
'watch', 'computed', 'props', 'template', 'components', 'directives', 'filters'
```

通过扩展的方法进行处理，例如：
```   
watch: {
  name: function (val, oldVal) {
    console.log('new: %s, old: %s', val, oldVal)
  }
}
``` 
会在标版的VM上面添加一个对name的watcher，如果标版上面有同名的watch，则会替换掉。
    
### 钩子的重载
```
'beforeCreate',
'created',
'beforeMount',
'mounted',
'beforeUpdate',
'updated',
'beforeDestroy',
'destroyed',
'activated',
'deactivated'  
```
Vue对应的每个生命周期钩子都进行了重载，重载规则是：如果没有对应钩子的则添加；如果有在对应钩子数组前面添加钩子。
保证重载的钩子在已有的钩子前面触发。

## 第二步：匹配对应组件
匹配对应的组件只需要声明对应的组件匹配规则即可，比如：
```
import AComp from 'path/to/AComp'
import BComp from 'path/to/BComp'
export default {
  '/your-override-uri': [
    { selector: 'title-box', handler: AComp },
    { selector: 'content-box', handler: BComp }
  ]
}
```
标准结构是：
```
{ '地址栏url的正则匹配': [
    { selector: '组件名称选择器', handler: '新组件' }
    ...
  ]
}
```
selector：就像使用标准的dom.querySelectorAll一样，唯一的区别就是你只能使用组件的名称（就像Dom元素的tagName）进行组合选择