const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const safeArea = Math.max(image.width, image.height) * 2

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
//  đặt mỗi kích thước thành gấp đôi kích thước lớn nhất để cho phép một khu vực an toàn cho
//  hình ảnh để xoay trong mà không bị cắt bởi bối cảnh canvas
  canvas.width = safeArea
  canvas.height = safeArea
// vẽ hình ảnh xoay và lưu trữ dữ liệu.
// translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

//vẽ hình ảnh xoay và lưu trữ dữ liệu.
// draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )
  const data = ctx.getImageData(0, 0, safeArea, safeArea)
//đặt chiều rộng vải thành kích thước cắt mong muốn cuối cùng - điều này sẽ xóa bối cảnh hiện có
  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
//dán hình ảnh xoay được tạo với độ lệch chính xác cho các giá trị x, y.
  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  )

  // As Base64 string
  return canvas.toDataURL('image/jpeg');

  // As a blob
  // return new Promise(resolve => {
  //   canvas.toBlob(file => {
  //     resolve(URL.createObjectURL(file))
  //   }, 'image/jpeg')
    
  // })
}
