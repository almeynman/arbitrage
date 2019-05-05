const removeUndefined = obj => {
  const o = { ...obj }

  Object.keys(o).forEach(key => {
    if (o[key] && Array.isArray(o[key])) o[key] = o[key].map(removeUndefined)
    else if (o[key] && typeof o[key] === 'object') o[key] = removeUndefined(o[key])
    else if (o[key] === undefined) delete o[key]
  })

  return o
}

exports.removeUndefined = removeUndefined
