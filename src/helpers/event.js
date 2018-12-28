export default class ViEvent {
  constructor() {
    this.map = {}
  }
  on(name, fn) {
    if (this.map[name]) {
      this.map[name].push(fn)
      return
    }

    this.map[name] = [fn]
  }
  emit(name, ...args) {
    this.map[name].forEach((fn) => {
      fn(...args)
    })
  }
}
