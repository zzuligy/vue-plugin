/**
 * Created by guoyangyang on 2017/8/17.
 */
export default {
  around (obj, fn, beforeFn) {
    let _fn = obj[ fn ]
    obj[ fn ] = function () {
      _fn.call(this)
      let ret = beforeFn.call(this)
      _fn.call(this, ret)
    }
  },
  before (obj, fn, beforeFn) {
    let _fn = obj[ fn ]
    obj[ fn ] = function () {
      let ret = beforeFn.apply(this, arguments)
      return _fn.call(this, ret)
    }
  },
  after (obj, fn, beforeFn) {
    let _fn = obj[ fn ]
    obj[ fn ] = function () {
      let ret = _fn.apply(this, arguments)
      return beforeFn.call(this, ret)
    }
  }
}
