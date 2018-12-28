export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  /* istanbul ignore if */
  if (hasClass(el, className)) {
    return
  }

  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass(el, className) {
  /* istanbul ignore if */
  if (!hasClass(el, className)) {
    return
  }

  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

export function checkClass(o) {
  return Object.prototype.toString.call(o).slice(8, -1)
}

export function deepClone(o) {
  let ret
  let instance = checkClass(o)
  if (instance === 'Array') {
    ret = []
  } else if (instance === 'Object') {
    ret = {}
  } else {
    return o
  }

  for (let key in o) {
    let copy = o[key]
    let instance = checkClass(copy)
    if (instance === 'Object') {
      ret[key] = deepClone(copy)
    } else if (instance === 'Array') {
      ret[key] = deepClone(copy)
    } else {
      ret[key] = copy
    }
  }

  return ret
}

/**
 *
 * 给target合并key(深度)
 * @export
 * @param {Object} to
 * @param {Object} from
 * @returns
 */
export function deepAssign(to, from) {
  for (let key in from) {
    if (!to[key] || typeof to[key] !== 'object') {
      to[key] = from[key]
    } else {
      deepAssign(to[key], from[key])
    }
  }
}

/**
 * 支持多参数的深度克隆
 * 后面的优先级最大
 * @export
 * @param {Object} target
 * @param {Object} rest
 * @returns
 */
export function mulitDeepClone(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let source = deepClone(rest[i])
    deepAssign(target, source)
  }
  return target
}

export function createURL(file) {
  const URL = window.URL || window.webkitURL || window.mozURL
  if (file && URL) {
    return URL.createObjectURL(file)
  }
  return ''
}

export function prependChild(parent, newChild, beforeChild) {
  if (parent.children[0]) {
    parent.insertBefore(newChild, beforeChild)
  } else {
    parent.appendChild(newChild)
  }
}

export function observeProperty(obj, key, fn) {
  var val = obj[key]
  Object.defineProperty(obj, key, {
    get: function () {
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      if (typeof fn === 'function') {
        fn(newVal)
      }
    }
  })
}
