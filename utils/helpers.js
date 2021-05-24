export function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function findByIdInArray(value, arr) {
  return arr.find(item => item._id === value)
}

export function findIndexByIdInArray(value, arr) {
  return arr.findIndex(item => item._id === value)
}
