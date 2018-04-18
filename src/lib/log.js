function info () {
  print(arguments, 'info')
}

function warn () {
  print(arguments, 'warn')
}

function error () {
  print(arguments, 'error')
}

function print (args, type) {
  if (!args.length) {
    return
  }
  if (args.length > 1) {
    console.group(args[0])
    for (let i in args) {
      let item = args[i]
      if (args.hasOwnProperty(i) && i !== '0') {
        _do(item)
      }
    }
    console.groupEnd()
  } else {
    _do(args[0])
  }

  function _do (item) {
    try {
      item = JSON.stringify(item)
      item = JSON.parse(item)
    } catch (err) {
    }
    console[type](item)
  }
}

export {info, warn, error}
