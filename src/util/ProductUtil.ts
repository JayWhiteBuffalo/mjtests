import MathUtil from '@util/MathUtil'
import StringUtil from '@util/StringUtil'
import {Treemap} from '@/Treemap'
import {VendorUtil} from '@util/VendorUtil'

const prng = MathUtil.lcg8()

const images = {
  sativa: 'ea5xdfszyqq2t3ahl4gb',
  indica: 'dm6dmpifpjmu5kzdeems',
}

export const ProductUtil = {
  images,

  read(product) {
    product.potency ??= {}
    product.potency.thc ??= 0
    product.potency.cbd ??= 0
    product.flags ??= {}
    product.pricePerGram = product.price / product.weight
    product.isDraft ??= false

    product.slug ??= ProductUtil.autoSlug(product)

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
        console.warn(`Invalid terpene '${terpName}' in product ${product.name}`)
        delete product.terps[terpName]
      }
    }

    if (product.productType === 'concentrate' && !Treemap.concentrateTypesByKey[product.concentrateType]) {
      console.warn(`Invalid concentrateType '${product.concentrateType}' in product ${product.name}`)
      product.concentrateType = 'unknown'
    }

    product.mainImageRefId = product.mainImageRefId
      ?? (
        (product.subspecies === 'sativa' || product.subspecies === 'hybridSativa')
          ? ProductUtil.images.sativa
          : ProductUtil.images.indica
      )
    return product
  },

  autoSlug(product) {
    const words = StringUtil.wordsFromSpaced((product.vendorName || '') + ' ' + product.name)
    return StringUtil.wordsToKebab(words).substring(0, 48)
  },

  populateDistance(product, center) {
    product.distance = product.vendor.latLng
      ? MathUtil.earthDistance(product.vendor.latLng, center)
      : undefined
    product.flags.openNow = product.vendor.openStatus.isOpen
  },
}
