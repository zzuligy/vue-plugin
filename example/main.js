import Vue from 'vue'
import App from './App'
import Plugin from '../src'

Vue.config.productionTip = false
let matcher = {
  '/': [
    {
      selector: 'test',
      handler: {
        data: function (param = {}) {
          console.log(param)
          param = {x: 1}
          return param
        },
        template: '<h1>{{x}}</h1>'
      }
    }
  ]
}
Plugin.start(matcher, Vue)
new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
})


