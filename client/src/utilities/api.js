export const fetch = async url => {
  // TODO: header options
  let res = await fetch(url)
  res = res.json()
  return res
}
