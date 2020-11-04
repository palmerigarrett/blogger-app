export default function validLength(greaterThan, lessThan, value) {
  const valueLength = value.length
  if (valueLength > greaterThan && valueLength < lessThan) {
      return true
  } else {
      return false
  }
}