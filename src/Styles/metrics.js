import { Dimensions, PixelRatio } from 'react-native'

const { width } = Dimensions.get('window')

const Swidth = 375

const px = (valuePx) => {
  const widthPercent = (valuePx / Swidth) * 100
  const screenPixel = PixelRatio.roundToNearestPixel(
    (width * parseFloat(widthPercent)) / 100
  ) // arredonda para o valor mais proximo
  return screenPixel
}

export const metrics = {
  px,
  width,
}
