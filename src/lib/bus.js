export default {
  $on (eventName, callback) {
    if (!this.handles) {
      // this.handles = {}
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false,
        configurable: true,
        writable: true
      })
    }
    if (!this.handles[eventName]) this.handles[eventName] = []
    this.handles[eventName].push(callback)
  },
  $emit (eventName, ...params) {
    // console.log('EventBus emit ventName===', eventName)
    if (this.handles[eventName]) {
      let len = this.handles[eventName].length
      for (let i = 0; i < len; i++) {
        this.handles[eventName][i](params)
      }
    }
  },
  $off (eventName) {
    delete this.handles[eventName]
  }
}
