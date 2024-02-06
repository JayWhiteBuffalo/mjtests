import MathUtil from '@util/MathUtil'
import {Treemap} from '@/Treemap'
import {VendorUtil} from '@util/VendorUtil'

const prng = MathUtil.lcg8()

export const ProductUtil = {
  read(product) {
    product.potency = product.potency || {}
    product.potency.thc = product.potency.thc || 0
    product.potency.cbd = product.potency.cbd || 0
    product.flags = product.flags || {}
    product.pricePerGram = product.price / product.weight

    if (!product.rating) {
      product.rating = {
        count: (prng.next().value % 4) * 0x100 + prng.next().value,
        average: prng.next().value % 8 === 0
          ? 2 + (prng.next().value / 0xff * 2)
          : 4 + (prng.next().value / 0xff)
      }
    }
    VendorUtil.readRating(product.rating)

    for (const terpName in product.terps) {
      if (!Treemap.terpenesByName[terpName]) {
        console.warn(`Invalid terpene '${terpName}' in product ${product.key}`)
        delete product.terps[terpName]
      }
    }

    if (product.productType === 'concentrate' && !Treemap.concentrateTypesByKey[product.concentrateType]) {
      console.warn(`Invalid concentrateType '${product.concentrateType}' in product ${product.key}`)
      product.concentrateType = 'unknown'
    }
  },

  populate(product, center) {
    product.key = product.vendorName + '.' + product.name
    product.imageUrl = product.imageUrl
      || (product.subspecies === 'sativa' || product.subspecies === 'hybridSativa')
        ? '/Sativa.png'
        : '/Indica.png'
    product.distance = MathUtil.earthDistance(product.vendor.latLng, center)
  },
}
