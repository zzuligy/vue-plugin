import bus from './lib/bus'
import comDecorate from './lib/com-decorate'
import {isSelectedCom} from './lib/util'
import {info} from './lib/log'

var ncname = '[a-zA-Z_][\\w\\-\\.]*'
var qnameCapture = '^((?:' + ncname + '\\:)?' + ncname + ')$'
var tagReg = new RegExp(qnameCapture)

class Selector {
  constructor (selector) {
    this.source = selector
    this.componentTag = this.isOnlyTag() ? selector : undefined
  }

  isOnlyTag () {
    return tagReg.test(this.source)
  }
}

/**
 * 句柄处理钩子事件
 * @param cdo  当前组件定义对象，init的时候和ready的时候有些差别
 * @param ctx  执行上下文
 */
let handler = ([cdo, ctx]) => {
  /**
   * 是否匹配到顶级组件
   * @param cdo
   * @param selector
   * @returns {boolean}
   */

  let type = 'init'

  function isTopCom (cdo, selector) {
    let {componentTag} = selector || {}
    componentTag === undefined && (componentTag = '')
    let isTopRouteCom = ((componentTag.length === 0) && cdo._componentTag === undefined && cdo.parent && /pages/.test(cdo.parent.$options._componentTag))
    return isTopRouteCom
  }

  /**
   * 根据选择器判断组件匹配
   * @param selector 选择器类
   * @param cdo  组件定义对象
   * @returns {boolean} 是否匹配到指定组件
   */
  function isMatchedCom (selector, cdo) {
    let isMatched = false

    if (selector.isOnlyTag()) {
      let componentTag = selector.source
      let cdoComponentTag = cdo._componentTag || cdo.options.name
      isMatched = (cdo && componentTag && (new RegExp(componentTag).test(cdoComponentTag)))
    } else if (selector.source) {
      isMatched = isSelectedCom(ctx.root, cdo, selector.source)
    }

    return isMatched
  }

  function applyHandler (cdo, handler) {
    handler && patchComponent(cdo, handler)
  }

  function patchComponent (cdo, overrideOpts) {
    comDecorate(cdo, overrideOpts)
  }

  function matchRule (cb) {
    let path = location.pathname
    let urls = Object.keys(ComponentMatcher)
    urls.forEach((url) => {
      let reg = new RegExp(url)
      if (reg.test(path)) {
        let declarations = ComponentMatcher[url]
        declarations.forEach((declaration) => {
          let handler = declaration.handler
          let selector = new Selector(declaration.selector)
          const flag = isMatchedCom(selector, cdo) || isTopCom(cdo, selector)
          if (flag) {
            info('component matched, selector is:', selector)
            cb.apply(this, [type, cdo, handler])
          }
        })
      }
    })
  }

  matchRule.call(this, (type, cdo, handler) => {
    applyHandler.apply(this, [cdo, handler])
  })
}

let ComponentMatcher = {}

function applyComponentMatcher (Matcher) {
  ComponentMatcher = Matcher
  // 这个是获取所有组件init。
  bus.$on('ComInit', handler)
}

export {applyComponentMatcher}
