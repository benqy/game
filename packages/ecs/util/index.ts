let _id = 0

export function getId() {
  _id++
  return _id.toString()
}
