/**
 * Created by guoyangyang on 2017/8/17.
 */
/**
 * 目前支持data，template，methods，ready的装饰
 * @param decorated
 * @param cfg
 */
import aop from './aop'
import {forEach, getAop, extend, generateRender, noop} from './util'

export default function comDecorate (decorated, cfg) {
  let decoratedOptions = decorated.$options || decorated.options || decorated

  let HOOKS = [
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
  ]
  let OVERRIDEOPTS = ['proxy', 'watch', 'computed', 'props', 'template', 'components', 'directives', 'filters']

  function overrideMethod (src, dst) {
    if (!dst.methods) {
      return
    }
    let srcMethods = src.methods = (src.methods || {})
    let dstMethods = dst.methods
    forEach(dstMethods, (item, key) => {
      let originKey = /^\$/.test(key) ? key.slice(1) : key
      originKey = /\$$/.test(key) ? originKey.slice(0, -1) : originKey
      if (srcMethods[originKey]) {
        let aopCfg = getAop(key)
        if (aopCfg.before || aopCfg.after) {
          aopCfg.before && aop.before(srcMethods, originKey, item)
          aopCfg.after && aop.after(srcMethods, originKey, item)
        } else {
          srcMethods[originKey] = item
        }
      } else {
        srcMethods[originKey] = item
      }
    })
  }

  function mergeHook (baseOpts, overrideOpts) {
    HOOKS.forEach((hookName) => {
      let overrideHook = overrideOpts[hookName]
      if (overrideHook) {
        baseOpts[hookName] ? baseOpts[hookName].unshift(overrideHook) : (baseOpts[hookName] = [overrideHook])
      }
    })
  }

  function overrideData (opts, cfg) {
    let _data = opts.data || noop
    let data = cfg.data
    data && (opts.data = function () {
      let ret = _data.call(this)
      let cfgData = data(ret)
      return cfgData
    })
  }

  function overrideOpts (opts, cfg) {
    OVERRIDEOPTS.forEach((opt) => {
      if (/template|proxy/.test(opt) && cfg[opt]) {
        opts[opt] = cfg[opt]
        if (/template/.test(opt)) {
          opts.render = generateRender(cfg[opt])
        }
        return
      }
      opts[opt] = opts[opt] || {}
      extend(opts[opt], cfg[opt])
    })
  }

  overrideData(decoratedOptions, cfg)

  // watch,computed
  overrideOpts(decoratedOptions, cfg)

  overrideMethod(decoratedOptions, cfg)

  mergeHook(decoratedOptions, cfg)
}
