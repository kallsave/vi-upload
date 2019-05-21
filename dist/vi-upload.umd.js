(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ViUpload = factory());
}(this, (function () { 'use strict';

  var ViEvent = function ViEvent() {
    this.map = {};
  };
  ViEvent.prototype.on = function on(name, fn) {
    if (this.map[name]) {
      this.map[name].push(fn);
      return;
    }

    this.map[name] = [fn];
  };
  ViEvent.prototype.emit = function emit(name) {
    var args = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      args[len] = arguments[len + 1];
    }this.map[name].forEach(function (fn) {
      fn.apply(void 0, args);
    });
  };

  function styleInject(css, ref) {
    if (ref === void 0) {
      ref = {};
    }
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

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

  var css = ".vi-upload-input-wrapper {\n  display: inline-block;\n  margin: 0 10px 10px 0;\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box {\n  position: relative;\n  width: 80px;\n  height: 80px;\n  box-sizing: border-box;\n  background-color: #fff;\n  box-shadow: 0 0 6px 2px rgba(0,0,0,0.08);\n  border-radius: 2px;\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box:before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 2px;\n  background-color: #666;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box:after {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 20px;\n  height: 2px;\n  background-color: #666;\n  -webkit-transform: translate(-50%, -50%) rotate(90deg);\n          transform: translate(-50%, -50%) rotate(90deg);\n}\n.vi-upload-input-wrapper .vi-upload-input-wrapper-box .vi-upload-input {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  font-size: 0;\n  opacity: 0;\n}\n.vi-upload-file {\n  display: inline-block;\n  margin: 0 10px 10px 0;\n}\n.vi-upload-file .vi-upload-file-box {\n  position: relative;\n  width: 80px;\n  height: 80px;\n  box-sizing: border-box;\n  background-color: #fff;\n  box-shadow: 0 0 6px 2px rgba(0,0,0,0.08);\n  border-radius: 2px;\n  background-size: cover;\n}\n.vi-upload-file .vi-upload-file-box .vi-upload-file-delete {\n  position: absolute;\n  z-index: 2;\n  top: -36px;\n  right: -36px;\n  width: 80px;\n  height: 80px;\n  background: #000;\n  border-radius: 50%;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n}\n.vi-upload-file .vi-upload-file-box .vi-upload-file-delete:before {\n  content: '';\n  position: absolute;\n  width: 6px;\n  height: 45px;\n  top: 50%;\n  left: 50%;\n  border-radius: 6px;\n  background-color: #fff;\n  -webkit-transform: translate(-50%, -50%) rotate(135deg);\n          transform: translate(-50%, -50%) rotate(135deg);\n}\n.vi-upload-file .vi-upload-file-box .vi-upload-file-delete:after {\n  content: '';\n  position: absolute;\n  width: 6px;\n  height: 45px;\n  top: 50%;\n  left: 50%;\n  border-radius: 6px;\n  background-color: #fff;\n  -webkit-transform: translate(-50%, -50%) rotate(-135deg);\n          transform: translate(-50%, -50%) rotate(-135deg);\n}\n";
  styleInject(css);

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function hasClass(el, className) {
    var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
  }

  function addClass(el, className) {
    /* istanbul ignore if */
    if (hasClass(el, className)) {
      return;
    }

    var newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
  }

  function checkClass(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  }

  function deepClone(o) {
    var ret;
    var instance = checkClass(o);
    if (instance === 'Array') {
      ret = [];
    } else if (instance === 'Object') {
      ret = {};
    } else {
      return o;
    }

    for (var key in o) {
      var copy = o[key];
      ret[key] = deepClone(copy);
    }

    return ret;
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
    for (var key in from) {
      if (!to[key] || _typeof(to[key]) !== 'object') {
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
  function mulitDeepClone(target) {
    var rest = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      rest[len] = arguments[len + 1];
    }for (var i = 0; i < rest.length; i++) {
      var source = deepClone(rest[i]);
      deepAssign(target, source);
    }
    return target;
  }

  function createURL(file) {
    var URL = window.URL || window.webkitURL || window.mozURL;
    if (file && URL) {
      return URL.createObjectURL(file);
    }
    return '';
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
      get: function get$$1() {
        return val;
      },
      set: function set$$1(newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        if (typeof fn === 'function') {
          fn(newVal);
        }
      }
    });
  }

  var DEFAULT_OPTIONS = {
    // 容器
    el: '',
    // 上传文件的个数
    max: 1,
    // 文件的最大存储
    maxSize: 0,
    // 自定义的容器,下版本
    slot: {}
  };

  var EVENT_ADD_FILES = 'addFiles';
  var EVENT_CHANGE_FILES = 'changeFiles';
  var EVENT_REMOVE_FILES = 'removeFiles';

  var ViUpload = function ViUpload(o) {
    this.options = mulitDeepClone({}, DEFAULT_OPTIONS, o);
    this.checkType();
    this.init();
  };
  ViUpload.prototype.init = function init() {
    var createSuccess = this.initWrapper();
    if (!createSuccess) {
      return;
    }
    this.initData();
    this.listenEvent();
    this.watch();
  };
  ViUpload.prototype.checkType = function checkType() {
    if (!(this.options.el instanceof window.HTMLElement)) {
      console.error("type check failed for options \"el\".");
    }
    if (typeof this.options.maxSize !== 'number') {
      console.error("type check failed for options \"maxSize\".");
    }
    if (typeof this.options.max !== 'number') {
      console.error("type check failed for options \"max\".");
    }
  };
  ViUpload.prototype.initWrapper = function initWrapper() {
    this.el = this.options.el;
    if (!this.el) {
      console.error("cannot find selector #" + this.el + ".");
      return false;
    }
    this.createInput();
    return true;
  };
  ViUpload.prototype.initData = function initData() {
    this.imgList = [];
    this.restImgLength = this.options.max;
  };
  ViUpload.prototype.listenEvent = function listenEvent() {
    var this$1 = this;

    this.ViEvent = new ViEvent();
    this.ViEvent.on(EVENT_ADD_FILES, function (files) {
      if (typeof this$1.options.events[EVENT_ADD_FILES] === 'function') {
        this$1.options.events[EVENT_ADD_FILES](files);
      }
    });
    this.ViEvent.on(EVENT_CHANGE_FILES, function (files) {
      if (typeof this$1.options.events[EVENT_CHANGE_FILES] === 'function') {
        this$1.options.events[EVENT_CHANGE_FILES](files);
      }
    });
    this.ViEvent.on(EVENT_REMOVE_FILES, function (removeFile) {
      if (typeof this$1.options.events[EVENT_REMOVE_FILES] === 'function') {
        this$1.options.events[EVENT_REMOVE_FILES](removeFile);
      }
    });
  };
  ViUpload.prototype.watch = function watch() {
    this.watchRestImgLength();
  };
  ViUpload.prototype.watchRestImgLength = function watchRestImgLength() {
    var this$1 = this;

    observeProperty(this, 'restImgLength', function (newVal) {
      if (newVal > 0) {
        this$1.inputWrapper.style.display = '';
      } else {
        this$1.inputWrapper.style.display = 'none';
      }
      this$1.ViEvent.emit(EVENT_CHANGE_FILES, this$1.imgList);
    });
  };
  ViUpload.prototype.createInput = function createInput() {
    var this$1 = this;

    this.inputWrapper = document.createElement('div');
    addClass(this.inputWrapper, 'vi-upload-input-wrapper');
    this.inputWrapper.innerHTML = "<div class=\"vi-upload-input-wrapper-box\">\n                      <input class=\"vi-upload-input\"\n                        type=\"file\"\n                        multiple=\"multiple\"\n                        accept=\"image/*\" />\n                    </div>";
    this.el.appendChild(this.inputWrapper);
    var input = this.inputWrapper.getElementsByTagName('input')[0];
    input.onchange = function (e) {
      var currentTarget = e.currentTarget;
      var persistedCurrentTarget = mulitDeepClone({}, currentTarget);
      var files = persistedCurrentTarget.files;
      var addFiles = [];
      var i = 0;
      var file = files[i];
      while (addFiles.length < files.length && file) {
        var url = createURL(file);
        addFiles.push(file);
        file.url = url;
        file = files[++i];
      }
      this$1.ViEvent.emit(EVENT_ADD_FILES, addFiles);
      this$1.createImg(addFiles);
    };
  };
  ViUpload.prototype.createImg = function createImg(addFiles) {
    var this$1 = this;

    var newFiles = [];
    var i = 0;
    var file = addFiles[i];
    while (newFiles.length < this.restImgLength && file) {
      newFiles.push(file);
      file = addFiles[++i];
    }
    var loop = function loop(j) {
      var item = newFiles[j];
      if (item.size > this$1.options.maxSize) {
        console.warn("the size of " + j + "th picture exceeds the options maxSize");
        return;
      }
      this$1.imgList.push(item);
      this$1.restImgLength = this$1.options.max - this$1.imgList.length;
      var fileDom = document.createElement('div');
      addClass(fileDom, 'vi-upload-file');
      fileDom.innerHTML = "<div class=\"vi-upload-file-box\">\n                            <i class=\"vi-upload-file-delete\"></i>\n                          </div>";
      var backgroundImageDom = fileDom.getElementsByClassName('vi-upload-file-box')[0];
      backgroundImageDom.style.backgroundImage = "url(" + item.url + ")";
      fileDom.appendChild(backgroundImageDom);
      prependChild(this$1.el, fileDom, this$1.inputWrapper);
      var icon = fileDom.getElementsByClassName('vi-upload-file-delete')[0];
      icon.onclick = function (e) {
        e.stopPropagation();
        var removeFile = this$1.imgList.splice(j, 1);
        this$1.restImgLength = this$1.options.max - this$1.imgList.length;
        this$1.el.removeChild(fileDom);
        this$1.ViEvent.emit(EVENT_REMOVE_FILES, removeFile);
      };
    };

    for (var j = 0; j < newFiles.length; j++) {
      loop(j);
    }
  };

  return ViUpload;

})));
