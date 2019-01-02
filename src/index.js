
import ViEvent from './helpers/event.js'
import './modules/style/vi-upload.styl'
import {
  mulitDeepClone,
  addClass,
  createURL,
  prependChild,
  observeProperty
} from './helpers/utils.js'

const DEFAULT_OPTIONS = {
  // 容器
  el: '',
  // 上传文件的个数
  max: 1,
  // 文件的最大存储
  maxSize: 0,
  // 自定义的容器,下版本
  slot: {}
}

const EVENT_ADD_FILES = 'addFiles'
const EVENT_CHANGE_FILES = 'changeFiles'
const EVENT_REMOVE_FILES = 'removeFiles'

export default class ViUpload {
  constructor(o) {
    this.options = mulitDeepClone({}, DEFAULT_OPTIONS, o)
    this.checkType()
    this.init()
  }
  init() {
    let createSuccess = this.initWrapper()
    if (!createSuccess) {
      return
    }
    this.initData()
    this.listenEvent()
    this.watch()
  }
  checkType() {
    if (!/#.+/.test(this.options.el)) {
      console.error(`type check failed for options "el". please use id selector`)
    }
    if (typeof this.options.maxSize !== 'number') {
      console.error(`type check failed for options "maxSize".`)
    }
    if (typeof this.options.max !== 'number') {
      console.error(`type check failed for options "max".`)
    }
  }
  initWrapper() {
    let elementName = this.options.el.slice(1)
    this.el = document.getElementById(elementName)
    if (!this.el) {
      console.error(`cannot find selector #${this.el}.`)
      return false
    }
    this.createInput()
    return true
  }
  initData() {
    this.imgList = []
    this.restImgLength = this.options.max
  }
  listenEvent() {
    this.ViEvent = new ViEvent()
    this.ViEvent.on(EVENT_ADD_FILES, (files) => {
      if (typeof this.options.events[EVENT_ADD_FILES] === 'function') {
        this.options.events[EVENT_ADD_FILES](files)
      }
    })
    this.ViEvent.on(EVENT_CHANGE_FILES, (files) => {
      if (typeof this.options.events[EVENT_CHANGE_FILES] === 'function') {
        this.options.events[EVENT_CHANGE_FILES](files)
      }
    })
    this.ViEvent.on(EVENT_REMOVE_FILES, (removeFile) => {
      if (typeof this.options.events[EVENT_REMOVE_FILES] === 'function') {
        this.options.events[EVENT_REMOVE_FILES](removeFile)
      }
    })
  }
  watch() {
    this.watchRestImgLength()
  }
  watchRestImgLength() {
    observeProperty(this, 'restImgLength', (newVal) => {
      if (newVal > 0) {
        this.inputWrapper.style.display = 'block'
      } else {
        this.inputWrapper.style.display = 'none'
      }
      this.ViEvent.emit(EVENT_CHANGE_FILES, this.imgList)
    })
  }
  createInput() {
    this.inputWrapper = document.createElement('div')
    addClass(this.inputWrapper, 'vi-upload-input-wrapper')
    this.inputWrapper.innerHTML = `<div class="vi-upload-input-wrapper-box">
                      <input class="vi-upload-input"
                        type="file"
                        multiple="multiple"
                        accept="image/*" />
                    </div>`
    this.el.appendChild(this.inputWrapper)
    let input = this.inputWrapper.getElementsByTagName('input')[0]
    input.onchange = (e) => {
      const currentTarget = e.currentTarget
      let persistedCurrentTarget = mulitDeepClone({}, currentTarget)
      let files = persistedCurrentTarget.files
      let addFiles = []
      let i = 0
      let file = files[i]
      while (addFiles.length < files.length && file) {
        let url = createURL(file)
        addFiles.push(file)
        file.url = url
        file = files[++i]
      }
      this.ViEvent.emit(EVENT_ADD_FILES, addFiles)
      this.createImg(addFiles)
    }
  }
  createImg(addFiles) {
    let newFiles = []
    let i = 0
    let file = addFiles[i]
    while (newFiles.length < this.restImgLength && file) {
      newFiles.push(file)
      file = addFiles[++i]
    }
    for (let j = 0; j < newFiles.length; j++) {
      let item = newFiles[j]
      if (item.size > this.options.maxSize) {
        console.warn(`the size of ${j}th picture exceeds the options maxSize`)
        continue
      }
      this.imgList.push(item)
      this.restImgLength = this.options.max - this.imgList.length
      let fileDom = document.createElement('div')
      addClass(fileDom, 'vi-upload-file')
      fileDom.innerHTML = `<div class="vi-upload-file-box">
                            <i class="vi-upload-file-delete"></i>
                          </div>`
      let backgroundImageDom = fileDom.getElementsByClassName('vi-upload-file-box')[0]
      backgroundImageDom.style.backgroundImage = `url(${item.url})`
      fileDom.appendChild(backgroundImageDom)
      prependChild(this.el, fileDom, this.inputWrapper)
      let icon = fileDom.getElementsByClassName('vi-upload-file-delete')[0]
      icon.onclick = (e) => {
        e.stopPropagation()
        let removeFile = this.imgList.splice(j, 1)
        this.restImgLength = this.options.max - this.imgList.length
        this.el.removeChild(fileDom)
        this.ViEvent.emit(EVENT_REMOVE_FILES, removeFile)
      }
    }
  }
}
