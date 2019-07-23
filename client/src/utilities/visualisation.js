/**
 *
 * @param {number} value - Value from 0 - 1
 * @return {string} - Hsl color string
 */
const getColorFromValue = value => {
  var hue = ((1 - value) * 120).toString(10)
  return ['hsl(', hue, ',100%,50%)'].join('')
}

export { getColorFromValue }
