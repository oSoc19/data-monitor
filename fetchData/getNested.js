// Return the nested property of an object or null if it doesn't exist
const get = (p, o) =>
  p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o)

module.exports = get;
