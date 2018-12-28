class ViEvent {
  constructor() {
    this.map = {};
  }
  on(name, fn) {
    if (this.map[name]) {
      this.map[name].push(fn);
      return
    }

    this.map[name] = [fn];
  }
  emit(name, ...args) {
    this.map[name].forEach((fn) => {
      fn(...args);
    });
  }
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".vi-upload-input-wrapper {\n  float: left;\n  overflow: hidden;\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box{\n  position: relative;\n  width: 80px;\n  height: 80px;\n  margin: 0 10px 10px 0;\n  box-sizing: border-box;\n  background-color: #fff;\n  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08);\n  border-radius: 2px;\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box:before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 2px;\n  background-color: #666;\n  transform: translate(-50%, -50%);\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box:after {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 2px;\n  background-color: #666;\n  transform: translate(-50%, -50%) rotate(90deg);\n}\n.vi-upload-input {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  font-size: 0;\n  opacity: 0;\n}\n.vi-upload-file {\n  float: left;\n  margin: 0 10px 10px 0;\n}\n.vi-upload-file .vi-upload-file-box {\n  position: relative;\n  width: 80px;\n  height: 80px;\n  box-sizing: border-box;\n  background-color: #fff;\n  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08);\n  border-radius: 2px;\n  background-size: cover;\n}\n.vi-upload-file .vi-upload-file-box .vi-upload-file-delete {\n  position: absolute;\n  z-index: 2;\n  top: -10px;\n  right: -10px;\n  width: 26px;\n  height: 26px;\n  background-size: cover;\n  background-image: url(\"data:image/png;base64,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\");\n}\n\n\n\n\n\n\n\n";
styleInject(css);

function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className)
}

function addClass(el, className) {
  /* istanbul ignore if */
  if (hasClass(el, className)) {
    return
  }

  const newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}



function checkClass(o) {
  return Object.prototype.toString.call(o).slice(8, -1)
}

function deepClone(o) {
  let ret;
  let instance = checkClass(o);
  if (instance === 'Array') {
    ret = [];
  } else if (instance === 'Object') {
    ret = {};
  } else {
    return o
  }

  for (let key in o) {
    let copy = o[key];
    let instance = checkClass(copy);
    if (instance === 'Object') {
      ret[key] = deepClone(copy);
    } else if (instance === 'Array') {
      ret[key] = deepClone(copy);
    } else {
      ret[key] = copy;
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
function deepAssign(to, from) {
  for (let key in from) {
    if (!to[key] || typeof to[key] !== 'object') {
      to[key] = from[key];
    } else {
      deepAssign(to[key], from[key]);
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
function mulitDeepClone(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let source = deepClone(rest[i]);
    deepAssign(target, source);
  }
  return target
}

function createURL(file) {
  const URL = window.URL || window.webkitURL || window.mozURL;
  if (file && URL) {
    return URL.createObjectURL(file)
  }
  return ''
}

function prependChild(parent, newChild, beforeChild) {
  if (parent.children[0]) {
    parent.insertBefore(newChild, beforeChild);
  } else {
    parent.appendChild(newChild);
  }
}

function observeProperty(obj, key, fn) {
  var val = obj[key];
  Object.defineProperty(obj, key, {
    get: function () {
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal;
      if (typeof fn === 'function') {
        fn(newVal);
      }
    }
  });
}

const DEFAULT_OPTIONS = {
  // 容器
  el: '',
  // 上传文件的个数
  max: 1,
  // 文件的最大存储
  maxSize: 0,
  // 自定义的容器,下版本
  slot: {}
};

const EVENT_ADD_FILES = 'addFiles';
const EVENT_CHANGE_FILES = 'changeFiles';
const EVENT_REMOVE_FILES = 'removeFiles';

class ViUpload {
  constructor(o) {
    this.options = mulitDeepClone({}, DEFAULT_OPTIONS, o);
    this.checkType();
    this.init();
  }
  init() {
    let createSuccess = this.initWrapper();
    if (!createSuccess) {
      return
    }
    this.initData();
    this.listenEvent();
    this.watch();
  }
  checkType() {
    if (!/#.+/.test(this.options.el)) {
      console.error(`type check failed for options "el". please use id selector`);
    }
    if (typeof this.options.maxSize !== 'number') {
      console.error(`type check failed for options "maxSize".`);
    }
    if (typeof this.options.max !== 'number') {
      console.error(`type check failed for options "max".`);
    }
  }
  initWrapper() {
    let elementName = this.options.el.slice(1);
    this.el = document.getElementById(elementName);
    if (!this.el) {
      console.error(`cannot find selector #${this.el}.`);
      return false
    }
    this.createInput();
    return true
  }
  initData() {
    this.imgList = [];
    this.restImgLength = this.options.max;
  }
  listenEvent() {
    this.ViEvent = new ViEvent();
    this.ViEvent.on(EVENT_ADD_FILES, (files) => {
      if (typeof this.options.events[EVENT_ADD_FILES] === 'function') {
        this.options.events[EVENT_ADD_FILES](files);
      }
    });
    this.ViEvent.on(EVENT_CHANGE_FILES, (files) => {
      if (typeof this.options.events[EVENT_CHANGE_FILES] === 'function') {
        this.options.events[EVENT_CHANGE_FILES](files);
      }
    });
    this.ViEvent.on(EVENT_REMOVE_FILES, (removeFile) => {
      if (typeof this.options.events[EVENT_REMOVE_FILES] === 'function') {
        this.options.events[EVENT_REMOVE_FILES](removeFile);
      }
    });
  }
  watch() {
    this.watchRestImgLength();
  }
  watchRestImgLength() {
    observeProperty(this, 'restImgLength', (newVal) => {
      if (newVal > 0) {
        this.inputWrapper.style.display = 'block';
      } else {
        this.inputWrapper.style.display = 'none';
      }
      this.ViEvent.emit(EVENT_CHANGE_FILES, this.imgList);
    });
  }
  createInput() {
    this.inputWrapper = document.createElement('div');
    addClass(this.inputWrapper, 'vi-upload-input-wrapper');
    this.inputWrapper.innerHTML = `<div class="vi-upload-input-wrapper-box">
                      <input class="vi-upload-input"
                        type="file"
                        multiple="multiple"
                        accept="image/*" />
                    </div>`;
    this.el.appendChild(this.inputWrapper);
    let input = this.inputWrapper.getElementsByTagName('input')[0];
    input.onchange = (e) => {
      const currentTarget = e.currentTarget;
      let persistedCurrentTarget = mulitDeepClone({}, currentTarget);
      let files = persistedCurrentTarget.files;
      let addFiles = [];
      let i = 0;
      let file = files[i];
      while (addFiles.length < files.length && file) {
        let url = createURL(file);
        addFiles.push(file);
        file.url = url;
        file = files[++i];
      }
      this.ViEvent.emit(EVENT_ADD_FILES, addFiles);
      this.createImg(addFiles);
    };
  }
  createImg(addFiles) {
    let newFiles = [];
    let i = 0;
    let file = addFiles[i];
    while (newFiles.length < this.restImgLength && file) {
      newFiles.push(file);
      file = addFiles[++i];
    }
    for (let j = 0; j < newFiles.length; j++) {
      let item = newFiles[j];
      if (item.size > this.options.maxSize) {
        console.warn(`the size of ${j}th picture exceeds the options maxSize`);
        continue
      }
      this.imgList.push(item);
      this.restImgLength = this.options.max - this.imgList.length;
      let fileDom = document.createElement('div');
      addClass(fileDom, 'vi-upload-file');
      fileDom.innerHTML = `<div class="vi-upload-file-box">
                            <i class="vi-upload-file-delete"></i>
                          </div>`;
      let backgroundImageDom = fileDom.getElementsByClassName('vi-upload-file-box')[0];
      backgroundImageDom.style.backgroundImage = `url(${item.url})`;
      fileDom.appendChild(backgroundImageDom);
      prependChild(this.el, fileDom, this.inputWrapper);
      let icon = fileDom.getElementsByClassName('vi-upload-file-delete')[0];
      icon.onclick = (e) => {
        e.stopPropagation();
        let removeFile = this.imgList.splice(j, 1);
        this.restImgLength = this.options.max - this.imgList.length;
        this.el.removeChild(fileDom);
        this.ViEvent.emit(EVENT_REMOVE_FILES, removeFile);
      };
    }
  }
}

export default ViUpload;
