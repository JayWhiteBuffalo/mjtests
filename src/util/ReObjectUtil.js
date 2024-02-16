import ObjectUtil from '@util/ObjectUtil'

const ReObjectUtil = {
  merge(xs, ys) {
    let changed = false
    for (const key in ys) {
      if (!ObjectUtil.deepEquals(xs[key], ys[key])) {
        if (!changed) {
          xs = {...xs}
          changed = true
        }
        xs[key] = ys[key]
      }
    }
    return xs
  }
}

export default ReObjectUtil
