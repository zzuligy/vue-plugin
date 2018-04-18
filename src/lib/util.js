/**
 * Created by guoyangyang on 2017/8/30.
 */
import Vue from 'vue'

let toString = Object.prototype.toString

function isUndef (val) {
  return typeof val === 'undefined'
}

function isObject (obj) {
  return toString.call(obj) === '[object Object]'
}

function noop () {

}

function forEach (collections, fn) {
  let _collections
  if (isObject(collections)) {
    _collections = collections
    collections = Object.keys(_collections)
  }
  for (let key of collections) {
    let items
    items = _collections || collections
    fn(items[key], key, items)
  }
}

function generateRender (tpl) {
  let render = Vue.compile(tpl)
  return render.render
}

function getAop (fnName) {
  let cfg = {before: false, after: false}
  if (/^\$/.test(fnName)) {
    cfg.before = true
  }
  if (/\$$/.test(fnName)) {
    cfg.after = true
  }
  return cfg
}

function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key]
  }
  return to
}

function isSelectedCom (vueInstanceTree, cdo, selector) {
  class Node {
    constructor (tag, id) {
      this.tag = tag
      this.id = id
      this.children = []
    }

    addChild (node) {
      this.children.push(node)
    }
  }

  function createElement (tag) {
    return document.createElement(tag)
  }

  function traverse (root, cb, parent, opts = {children: 'children', id: 'id'}) {
    let mappingNode = cb(root, parent)
    let {children, id} = opts
    let rootNode
    parent || (rootNode = mappingNode)
    traverse.__NodeMap = traverse.__NodeMap || new Map()
    traverse.__NodeMap.set(root[id], mappingNode)
    root[children] && root[children].forEach((node) => {
      let parentNode = traverse.__NodeMap.get(root[id])
      traverse(node, cb, parentNode, opts)
    })
    parent || traverse.__NodeMap.clear()
    return rootNode
  }

  function transform2StandardTree (vueInstanceTree) {
    let rootNode = traverse(vueInstanceTree, function (instance, parent) {
      let tagName = instance.$options._componentTag || '__unknowTagName'
      let id = instance._uid
      let node = new Node(tagName, id)
      parent && parent.addChild(node)
      return node
    }, null, {children: '$children', id: '_uid'})
    return rootNode
  }

  function transform2DOMTree (root) {
    traverse(root, function (node, parent) {
      let ele = createElement(node.tag)
      node.ele = ele
      isUndef(node.id) || (node.ele.dataset.id = node.id)
      parent && parent.ele.appendChild(ele)
      return node
    })
    return root.ele
  }

  function isSelected (selectedComponentEles, cdo) {
    function isSelectedCurrentCdo (components, cdo) {
      return [].some.call(components, (ele) => {
        return ele.tagName.toLowerCase() === cdo._componentTag.toLowerCase() && typeof ele.dataset.id === 'undefined'
      })
    }

    return !!selectedComponentEles.length && isSelectedCurrentCdo(selectedComponentEles, cdo)
  }

  function patch (cdo) {
    cdo.parent.$children.push({$options: {_componentTag: cdo._componentTag}})
  }

  function clearPatch (cdo) {
    cdo.parent.$children.length = cdo.parent.$children.length - 1
  }

  patch(cdo)
  let standardTree = transform2StandardTree(vueInstanceTree)
  clearPatch(cdo)
  let rootEle = transform2DOMTree(standardTree)
  let selectedComponentEles = rootEle.querySelectorAll(selector)
  let ret = isSelected(selectedComponentEles, cdo)
  return ret
}

export {
  forEach, noop, getAop, extend, generateRender, isSelectedCom
}
