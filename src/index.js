import {applyInterceptor} from './interceptor'
import {applyComponentMatcher} from './matcher'

function start (matcher, Vue) {
  applyInterceptor(Vue)
  applyComponentMatcher(matcher)
}

export default {start}
