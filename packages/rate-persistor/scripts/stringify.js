exports.stringify = (obj) => JSON.stringify(obj, (k, v) => (v === undefined ? null : v), 4)
