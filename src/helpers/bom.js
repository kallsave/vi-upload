export function createURL(file) {
  const URL = window.URL || window.webkitURL || window.mozURL
  if (file && URL) {
    return URL.createObjectURL(file)
  }
  return ''
}

export function getBase64(url) {
  return new Promise((resolve) => {
    const Image = window.Image
    let image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
    image.onload = () => {
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      let context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      let base64 = canvas.toDataURL('image/png')
      image = null
      resolve(base64)
    }
  })
}
