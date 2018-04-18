import bus from './lib/bus'
import {info} from './lib/log'

function applyInterceptor (Vue) {
  let _vueInit = Vue.prototype._init
  Vue.prototype._init = function (options) {
    options = options || {}
    options.options = this.constructor.options
    this.constructor.options = Object.create(this.constructor.options)
    bus.$emit('ComInit', options, this)
    info(`when init, intercept component:`, options)
    _vueInit.call(this, options)
    // 影响到了popup的render方法
    if (_vueInit) {
      _vueInit.call(this, options)
      resetOptions.call(this)
    }
  }

  function resetOptions () {
    this.constructor.options = Object.getPrototypeOf(this.constructor.options)
  }
}

export {applyInterceptor}
