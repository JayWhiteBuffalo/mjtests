import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'

const productTypes = [
  {
    name: 'Flower',
  },
  {
    name: 'Pre-roll',
    key: 'preroll',
  },
  {
    name: 'Shake',
  },
  {
    name: 'Concentrate',
  },
  {
    name: 'Edible',
  },
  {
    name: 'Related Products',
  },
]

productTypes.forEach((props, ix) => {
  props.key ??= StringUtil.toLowerCamel(props.name)
  props.index = ix
})

const subspecies = [
  {
    name: 'Indica',
    filterable: true,
  },
  {
    name: 'Hybrid Indica',
    key: 'hybridIndica',
    filterable: true,
  },
  {
    name: 'Hybrid',
  },
  {
    name: 'Hybrid Sativa',
    key: 'hybridSativa',
    filterable: true,
  },
  {
    name: 'Sativa',
    filterable: true,
  },
]

subspecies.forEach((props, ix) => {
  props.key ??= StringUtil.toLowerCamel(props.name)
  props.index = ix
})

const filterableSubspecies = subspecies.filter(x => x.filterable)

const concentrateTypes = [
  {
    name: 'Batter, Badder, Budder',
    key: 'badder',
  },
  {
    name: 'Caviar',
  },
  {
    name: 'CBD Oil',
  },
  {
    name: 'Crumble',
  },
  {
    name: 'Crystalline/Sugar',
    key: 'crystalline',
  },
  {
    name: 'Diamonds',
  },
  {
    name: 'Distillate',
  },
  {
    name: 'Dry Sift',
  },
  {
    name: 'Flower Essential Oil',
  },
  {
    name: 'Hash',
  },
  {
    name: 'Bubble Hash, Ice Hash',
    key: 'iceHash',
  },
  {
    name: 'Honeycomb',
  },
  {
    name: 'Live Resin',
  },
  {
    name: 'Kief',
  },
  {
    name: 'Nug Run',
  },
  {
    name: 'Rosin',
  },
  {
    name: 'Sauce',
  },
  {
    name: 'Shatter',
  },
  {
    name: 'Taffy',
  },
  {
    name: 'Terp Oil',
  },
  {
    name: 'THC Oil',
  },
  {
    name: 'Tinctures',
  },
  {
    name: 'Wax',
  },
]

concentrateTypes.forEach((props, ix) => {
  props.key ??= StringUtil.toLowerCamel(props.name)
  props.index = ix
})

/*
Sources:
https://www.mybpg.com/blog/cannabis-terpenes/
https://cannacon.org/15-terpenes-cannabis-explained/
*/
const terpenes = [
  {
    name: 'bisabolol',
    color: '#63C5DA',
    properties: ['anti-inflammatory', 'anti-irritant', 'anti-microbial'],
    scents: 'floral',
    aliases: ['α-bisabolol', 'levomenol'],
  },
  {
    name: 'borneol',
    color: '#FCEBA4',
    properties: ['anti-inflammatory', 'antinociceptive'],
    scents: 'mint',
  },
  {
    name: 'camphene',
    color: '#4CB043',
    properties: ['anti-oxidant', 'skin leision'],
    scents: 'fir needles, musky earth',
  },
  {
    name: 'caryophyllene',
    color: '#3DED97',
    properties: ['anti-bacterial', 'anti-inflammatory', 'anti-fungal'],
    scents: 'spicy',
    aliases: ['β-caryophyllene', 'BCP'],
    includes: ['caryophyllene oxide'],
  },
  {
    name: 'delta 3-carene',
    color: '#B1560F',
    properties: ['anti-inflammatory', 'bone stimulant'],
    scents: 'pine, rosemary',
  },
  {
    name: 'eucalyptol',
    color: '#FC6600',
    properties: ['anti-bacterial', 'anti-fungal'],
    scents: 'mint',
  },
  {
    name: 'geraniol',
    color: '#E4A0F7',
    properties: ['anti-cancer', 'anti-oxidant', 'neuroprotectant'],
    scents: 'peach, rose grass',
  },
  {
    name: 'humulene',
    color: '#65350F',
    properties: ['anti-bacterial', 'anti-inflammatory', 'anti-tumor effects'],
    scents: 'earthy',
    aliases: ['α-humulene', 'α-caryophyllene'],
  },
  {
    name: 'limonene',
    color: '#D9DDDC',
    properties: ['anti-anxiety', 'anti-cancer', 'digestion', 'gallstones'],
    scents: 'bitter citrus',
    includes: ['δ-limonene'],
  },
  {
    name: 'linalool',
    color: '#B200ED',
    properties: [
      'anti-anxiety',
      'anti-epileptic',
      'anti-psychotic',
      'pain killing',
    ],
    scents: 'floral',
  },
  {
    name: 'myrcene',
    color: '#6F2DA8',
    properties: ['relaxing', 'sedating'],
    scents: 'citrus, cloves',
    aliases: ['β-myrcene'],
  },
  {
    name: 'pinene',
    color: '#FCEBA4',
    properties: ['anti-depressant', 'anti-inflammatory', 'anti-microbial'],
    scents: 'pine',
    includes: ['α-pinene', 'β-pinene'],
  },
  {
    name: 'phytol',
    color: '#234F1E',
    properties: ['anti-insomnia', 'immunosuppressant'],
    scents: 'balsamic, floral',
  },
  {
    name: 'terpinene',
    color: '#6F2DA8',
    properties: [
      'anti-bacterial',
      'anti-fungal',
      'anti-insomnia',
      'antiseptic',
    ],
    scents: 'smokey, woody',
    aliases: ['δ-terpinene', 'terpinolene'],
  },
  {
    name: 'nerolidol',
    color: '#7FCB78',
    properties: [
      'anti-cancer',
      'anti-microbial',
      'anti-oxidant',
      'anti-parasatic',
    ],
    scents: 'citrus, rose',
    aliases: ['trans-nerolidol'],
  },
  {
    name: 'valencene',
    color: '#D9DDDC',
    properties: ['anti-inflammatory', 'anti-melanogenesis', 'antiallergic'],
    scents: 'sweet citrus',
  },

  {
    name: 'guaiol',
    color: '#D9DDDC',
    properties: ['anti-hypertensive', 'anti-oxidant'],
    scents: 'wood, pine, rose, fruit',
  },
  {
    name: 'isopulegol',
    color: '#3944BC',
    properties: ['anti-anxiety', 'anti-convulsant', 'gastoprotective'],
    scents: 'wood, pine, rose, fruit',
  },
  {
    name: 'beta-ocimene',
    color: '#3DED97',
    properties: ['anti-inflammatory', 'decongestant', 'causes coughing'],
    scents: 'wood, sweet, citurs, floral, mint',
    includes: ['cis-ocimene', 'trans-ocimene'],
  },
  {
    name: 'α-terpinene',
  },
  {
    name: 'γ-terpinene',
  },
]

terpenes.forEach((props, ix) => {
  if (ix < 19) {
    props.core = true
  }
  props.color = props.color && `oklch(from ${props.color} calc(l - 0.15) c h)`
  props.index = ix
})

const terpenesByName = {}
for (const props of terpenes) {
  terpenesByName[props.name] = props
  for (const name of [...(props.includes || []), ...(props.aliases || [])]) {
    terpenesByName[name] = props
  }
}

export const Treemap = {
  concentrateTypes,
  concentrateTypesByKey: ObjectUtil.fromIterable(concentrateTypes, x => x.key),
  filterableSubspecies,
  productTypes,
  productTypesByKey: ObjectUtil.fromIterable(productTypes, x => x.key),
  subspecies,
  subspeciesByKey: ObjectUtil.fromIterable(subspecies, x => x.key),
  terpenes,
  terpenesByName,
}
