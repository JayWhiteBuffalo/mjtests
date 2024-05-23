import {VendorUtil} from '@util/VendorUtil'
import {ProductUtil} from '@util/ProductUtil'

const products = [
  {
    name: 'OG Shark 3.5g',
    productType: 'flower',
    subspecies: 'hybrid',
    cultivar: 'OG Shark',
    brand: 'Brand #1',
    price: 42.5,
    weight: 3.5,
    potency: {thc: 0.214},
    terps: {
      limonene: 0.0099,
      'β-caryophyllene': 0.009,
      'β-myrcene': 0.0018,
      'α-humulene': 0.0013,
      'α-pinene': 0.0012,
      guaiol: 0.0007,
      linalool: 0.0006,
      'caryophyllene oxide': 0.0004,
      camphene: 0.0003,
      'α-bisabolol': 0.0002,
    },
    vendorName: 'Dispensary #1',
  },
  {
    name: 'Afghani 7g',
    productType: 'flower',
    subspecies: 'indica',
    cultivar: 'Afghani',
    brand: 'Brand #1',
    price: 80,
    weight: 7,
    potency: {thc: 0.156},
    terps: {
      limonene: 0.0089,
      'β-pinene': 0.0035,
      'β-caryophyllene': 0.0024,
      'β-myrcene': 0.0018,
      'α-pinene': 0.0011,
      linalool: 0.0008,
      'α-humulene': 0.0004,
      camphene: 0.0003,
      nerolidol: 0.0001,
    },
    vendorName: 'Dispensary #1',
    flags: {
      topSeller: true,
    },
  },
  {
    name: 'Skywalker OG 14g',
    productType: 'flower',
    subspecies: 'hybridIndica',
    cultivar: 'Skywalker OG',
    brand: 'Brand #1',
    price: 155,
    weight: 14,
    potency: {thc: 0.229},
    terps: {
      'β-myrcene': 0.0138,
      geraniol: 0.0019,
      limonene: 0.0015,
      linalool: 0.0009,
      'α-pinene': 0.0009,
      'β-pinene': 0.0008,
      caryophyllene: 0.0008,
      nerolidol: 0.0006,
      guaiol: 0.0004,
      'α-bisabolol': 0.0004,
      'α-humulene': 0.0003,
      isopulegol: 0.0002,
      'trans-ocimene': 0.0001,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #2',
  },
  {
    name: 'Sweet Skunk 3.5g',
    productType: 'flower',
    subspecies: 'sativa',
    cultivar: 'Sweet Skunk CBD',
    brand: 'Brand #1',
    price: 45.9,
    weight: 3.5,
    potency: {thc: 0.091, cbd: 0.112},
    terps: {
      'β-caryophyllene': 0.0067,
      'β-myrcene': 0.0022,
      'α-humulene': 0.0021,
      limonene: 0.0014,
      linalool: 0.0012,
      'α-bisabolol': 0.0007,
      'caryophyllene oxide': 0.0004,
      'β-pinene': 0.0004,
      isopulegol: 0.0002,
      'α-pinene': 0.0002,
      'trans-ocimene': 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #3',
  },
  {
    name: 'Pineapple Express preroll 10ct 0.5g',
    productType: 'preroll',
    subspecies: 'hybridSativa',
    cultivar: 'Pineapple Express',
    brand: 'Brand #2',
    price: 85,
    weight: 5,
    potency: {thc: 0.12},
    terps: {
      'β-caryophyllene': 0.0046,
      'δ-limonene': 0.0034,
      humulene: 0.0019,
      'α-bisabolol': 0.0012,
      myrcene: 0.0002,
      isopulegol: 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #3',
  },
  {
    name: 'Sweet Skunk preroll 10ct 0.5g',
    productType: 'preroll',
    subspecies: 'sativa',
    cultivar: 'Sweet Skunk',
    brand: 'Brand #2',
    price: 85,
    weight: 5,
    potency: {thc: 0.12},
    terps: {
      'β-myrcene': 0.0067,
      limonene: 0.0058,
      caryophyllene: 0.0029,
      linalool: 0.0015,
      'β-pinene': 0.0014,
      'α-pinene': 0.0011,
      'α-humulene': 0.0009,
      'α-bisabolol': 0.0009,
      'trans-ocimene': 0.0003,
      'caryophyllene oxide': 0.0002,
      camphene: 0.0002,
      isopulegol: 0.0001,
      'cis-ocimene': 0.0001,
      terpinolene: 0.0001,
    },
    vendorName: 'Dispensary #4',
  },
  {
    name: 'Afghani preroll 10ct 0.5g',
    productType: 'preroll',
    subspecies: 'indica',
    cultivar: 'Sweet Skunk',
    brand: 'Brand #2',
    price: 85,
    weight: 5,
    potency: {thc: 0.12},
    terps: {
      'β-myrcene': 0.0076,
      limonene: 0.0073,
      caryophyllene: 0.0043,
      linalool: 0.0027,
      'trans-ocimene': 0.0018,
      'β-pinene': 0.0016,
      geraniol: 0.0015,
      'α-humulene': 0.0013,
      'α-pinene': 0.0012,
      'α-bisabolol': 0.0011,
      'trans-nerolidol': 0.0006,
      nerolidol: 0.0006,
      isopulegol: 0.0003,
      //'caryophyllene': 0.0003,
      camphene: 0.0002,
      'cis-ocimene': 0.0002,
      terpinolene: 0.0001,
    },
    vendorName: 'Dispensary #5',
  },
  {
    name: 'Durban Poison preroll 30ct 0.5g',
    productType: 'preroll',
    subspecies: 'sativa',
    cultivar: 'Durban Poison',
    brand: 'Brand #2',
    price: 218,
    weight: 15,
    potency: {thc: 0.18},
    terps: {
      myrcene: 0.0073,
      limonene: 0.0067,
      'β-caryophyllene': 0.0039,
      linalool: 0.0025,
      'α-humulene': 0.0015,
      'β-pinene': 0.0013,
      guaiol: 0.001,
      'α-pinene': 0.0007,
      'α-bisabolol': 0.0007,
      nerolidol: 0.0006,
      'trans-nerolidol': 0.0006,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0002,
      'cis-ocimene': 0.0001,
      isopulegol: 0.0001,
      terpinolene: 0.0001,
    },
    vendorName: 'Dispensary #5',
  },
  {
    name: 'Purple Kush preroll 10ct 0.5g',
    productType: 'preroll',
    subspecies: 'indica',
    cultivar: 'Purple Kush',
    brand: 'Brand #2',
    price: 78,
    weight: 5,
    potency: {thc: 0.165},
    terps: {
      myrcene: 0.0073,
      limonene: 0.0067,
      'β-caryophyllene': 0.0039,
      linalool: 0.0025,
      'α-humulene': 0.0015,
      'β-pinene': 0.0013,
      guaiol: 0.001,
      'α-pinene': 0.0007,
      'α-bisabolol': 0.0007,
      nerolidol: 0.0006,
      'trans-nerolidol': 0.0006,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0002,
      'cis-ocimene': 0.0001,
      isopulegol: 0.0001,
      terpinolene: 0.0001,
    },
    vendorName: 'Dispensary #5',
  },
  {
    name: 'Northern Lights preroll 10ct 0.5g',
    productType: 'preroll',
    subspecies: 'indica',
    cultivar: 'Northern Lights',
    brand: 'Brand #3',
    price: 78,
    weight: 5,
    potency: {thc: 0.14, cbd: 0.18},
    terps: {
      'β-caryophyllene': 0.0046,
      'δ-limonene': 0.0034,
      humulene: 0.0019,
      'α-bisabolol': 0.0012,
      myrcene: 0.0002,
      isopulegol: 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #6',
    flags: {
      hot: true,
    },
  },
  {
    name: 'Northern Lights 3.5g',
    productType: 'flower',
    subspecies: 'indica',
    cultivar: 'Northern Lights',
    brand: 'Brand #3',
    price: 38,
    weight: 3.5,
    potency: {thc: 0.14, cbd: 0.18},
    terps: {
      'β-caryophyllene': 0.0046,
      'δ-limonene': 0.0034,
      humulene: 0.0019,
      'α-bisabolol': 0.0012,
      myrcene: 0.0002,
      isopulegol: 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #6',
  },
  {
    name: 'Northern Lights 7g',
    productType: 'flower',
    subspecies: 'indica',
    cultivar: 'Northern Lights',
    brand: 'Brand #4',
    price: 72,
    weight: 7,
    potency: {thc: 0.14, cbd: 0.18},
    terps: {
      'β-caryophyllene': 0.0046,
      'δ-limonene': 0.0034,
      humulene: 0.0019,
      'α-bisabolol': 0.0012,
      myrcene: 0.0002,
      isopulegol: 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #7',
    flags: {
      hot: true,
    },
  },
  {
    name: 'Jack Herer 7g',
    productType: 'flower',
    subspecies: 'hybridSativa',
    cultivar: 'Jack Herer',
    brand: 'Brand #5',
    price: 90,
    weight: 7,
    potency: {thc: 0.16},
    terps: {
      'δ-limonene': 0.0034,
      'α-bisabolol': 0.0012,
      myrcene: 0.0002,
      humulene: 0.002,
      camphene: 0.0001,
      isopulegol: 0.0001,
    },
    vendorName: 'Dispensary #7',
    flags: {
      promotion: true,
      topSeller: true,
    },
  },
  {
    name: 'Jack Herer 7g',
    productType: 'flower',
    subspecies: 'hybrid',
    cultivar: 'Jack Herer',
    brand: 'Brand #5',
    price: 87,
    weight: 7,
    potency: {thc: 0.16},
    terps: {
      'δ-limonene': 0.0034,
      'α-bisabolol': 0.0012,
      myrcene: 0.0002,
      humulene: 0.002,
      camphene: 0.0001,
      isopulegol: 0.0001,
    },
    vendorName: 'Dispensary #1',
  },
  {
    name: 'Strawberry Cough 3.5g',
    productType: 'flower',
    subspecies: 'hybridSativa',
    cultivar: 'Strawberry Cough',
    brand: 'Brand #6',
    price: 48,
    weight: 3.5,
    potency: {thc: 0.15},
    terps: {
      'β-caryophyllene': 0.005,
      myrcene: 0.0023,
      'δ-limonene': 0.0031,
      humulene: 0.0022,
      'α-bisabolol': 0.0014,
      linalool: 0.0006,
      'caryophyllene oxide': 0.0002,
      isopulegol: 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #1',
  },
  {
    name: 'Strawberry Cough 3.5g',
    productType: 'flower',
    subspecies: 'hybridSativa',
    cultivar: 'Strawberry Cough',
    brand: 'Brand #6',
    price: 45,
    weight: 3.5,
    potency: {thc: 0.15},
    terps: {
      'β-caryophyllene': 0.005,
      myrcene: 0.0023,
      'δ-limonene': 0.0031,
      humulene: 0.0022,
      'α-bisabolol': 0.0014,
      linalool: 0.0006,
      'caryophyllene oxide': 0.0002,
      isopulegol: 0.0001,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #8',
  },
  {
    name: 'Granddaddy Purp 3.5g',
    productType: 'flower',
    subspecies: 'hybridIndica',
    cultivar: 'Granddaddy Purp',
    brand: 'Brand #7',
    price: 44,
    weight: 3.5,
    potency: {thc: 0.08},
    terps: {
      'β-caryophyllene': 0.0068,
      'α-terpinene': 0.005,
      'δ-limonene': 0.0035,
      humulene: 0.0028,
      myrcene: 0.0027,
      'β-pinene': 0.0014,
      linalool: 0.0013,
      'α-bisabolol': 0.0008,
      nerolidol: 0.0007,
      'caryophyllene oxide': 0.0004,
      camphene: 0.0001,
    },
    vendorName: 'Dispensary #8',
  },
  {
    name: 'Banana Kush 28g',
    productType: 'flower',
    subspecies: 'hybridIndica',
    cultivar: 'Banana Kush',
    brand: 'Brand #7',
    price: 310,
    weight: 28,
    potency: {thc: 0.14},
    terps: {
      'β-caryophyllene': 0.0064,
      nerolidol: 0.0027,
      'δ-limonene': 0.0027,
      myrcene: 0.0024,
      'β-pinene': 0.0023,
      humulene: 0.0023,
      linalool: 0.0018,
      'α-bisabolol': 0.0011,
      eucalyptol: 0.0005,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #9',
    flags: {
      new: true,
    },
  },
  {
    name: 'Runtz 3.5g',
    productType: 'flower',
    subspecies: 'hybrid',
    cultivar: 'Runtz',
    brand: 'Brand #7',
    price: 43,
    weight: 3.5,
    potency: {thc: 0.17},
    terps: {
      'β-caryophyllene': 0.0059,
      'δ-limonene': 0.0039,
      myrcene: 0.003,
      linalool: 0.0027,
      humulene: 0.0022,
      nerolidol: 0.0019,
      'β-pinene': 0.0013,
      'α-terpinene': 0.0005,
      'α-bisabolol': 0.0005,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0003,
    },
    vendorName: 'Dispensary #9',
    flags: {
      new: true,
    },
  },
  {
    name: 'Runtz 3.5g',
    productType: 'shake',
    subspecies: 'hybrid',
    cultivar: 'Runtz',
    brand: 'Brand #7',
    price: 7.2,
    weight: 3.5,
    potency: {thc: 0.17},
    terps: {
      'β-caryophyllene': 0.0059,
      'δ-limonene': 0.0039,
      myrcene: 0.003,
      linalool: 0.0027,
      humulene: 0.0022,
      nerolidol: 0.0019,
      'β-pinene': 0.0013,
      'α-terpinene': 0.0005,
      'α-bisabolol': 0.0005,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0003,
    },
    vendorName: 'Dispensary #6',
    flags: {
      promotion: true,
      hot: true,
    },
  },
  {
    name: 'Wedding Cake Live Rosin Badder',
    productType: 'concentrate',
    concentrateType: 'badder',
    subspecies: 'hybridIndica',
    cultivar: 'Wedding Cake',
    brand: 'Brand #8',
    price: 65,
    weight: 1,
    potency: {thc: 0.804},
    terps: {
      caryophyllene: 0.0058,
      'δ-limonene': 0.0037,
      myrcene: 0.0024,
      humulene: 0.0024,
      linalool: 0.0017,
      'α-bisabolol': 0.0015,
      nerolidol: 0.0013,
      'β-pinene': 0.001,
      guaiol: 0.0007,
      eucalyptol: 0.0004,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #6',
  },
  {
    name: 'Wedding Cake Live Rosin Budder',
    productType: 'concentrate',
    concentrateType: 'badder',
    subspecies: 'hybridIndica',
    cultivar: 'Wedding Cake',
    brand: 'Brand #8',
    price: 60.5,
    weight: 1,
    potency: {thc: 0.804},
    terps: {
      caryophyllene: 0.0058,
      'δ-limonene': 0.0037,
      myrcene: 0.0024,
      humulene: 0.0024,
      linalool: 0.0017,
      'α-bisabolol': 0.0015,
      nerolidol: 0.0013,
      'β-pinene': 0.001,
      guaiol: 0.0007,
      eucalyptol: 0.0004,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #6',
  },
  {
    name: 'Wedding Cake Crumble',
    productType: 'concentrate',
    concentrateType: 'crumble',
    subspecies: 'hybridIndica',
    cultivar: 'Wedding Cake',
    brand: 'Brand #8',
    price: 22,
    weight: 1,
    potency: {thc: 0.86},
    terps: {
      caryophyllene: 0.0058,
      'δ-limonene': 0.0037,
      myrcene: 0.0024,
      humulene: 0.0024,
      linalool: 0.0017,
      'α-bisabolol': 0.0015,
      nerolidol: 0.0013,
      'β-pinene': 0.001,
      guaiol: 0.0007,
      eucalyptol: 0.0004,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #6',
  },
  {
    name: 'Wedding Cake Live Resin Diamonds',
    productType: 'concentrate',
    concentrateType: 'crystalline',
    subspecies: 'hybridIndica',
    cultivar: 'Wedding Cake',
    brand: 'Brand #8',
    price: 28,
    weight: 1,
    potency: {thc: 0.88},
    terps: {
      caryophyllene: 0.0058,
      'δ-limonene': 0.0037,
      myrcene: 0.0024,
      humulene: 0.0024,
      linalool: 0.0017,
      'α-bisabolol': 0.0015,
      nerolidol: 0.0013,
      'β-pinene': 0.001,
      guaiol: 0.0007,
      eucalyptol: 0.0004,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #6',
  },
  {
    name: 'Super Silver Haze Live Rosin Badder',
    productType: 'concentrate',
    concentrateType: 'badder',
    subspecies: 'hybridSativa',
    cultivar: 'Super Silver Haze',
    brand: 'Brand #9',
    price: 42,
    weight: 1,
    potency: {thc: 0.801},
    terps: {
      'β-caryophyllene': 0.0064,
      nerolidol: 0.0027,
      'δ-limonene': 0.0027,
      myrcene: 0.0024,
      'β-pinene': 0.0023,
      humulene: 0.0023,
      linalool: 0.0018,
      'α-bisabolol': 0.0011,
      eucalyptol: 0.0005,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #9',
  },
  {
    name: 'Super Silver Haze Crumble',
    productType: 'concentrate',
    concentrateType: 'crumble',
    subspecies: 'hybridSativa',
    cultivar: 'Super Silver Haze',
    brand: 'Brand #9',
    price: 19,
    weight: 1,
    potency: {thc: 0.836},
    terps: {
      'β-caryophyllene': 0.0064,
      nerolidol: 0.0027,
      'δ-limonene': 0.0027,
      myrcene: 0.0024,
      'β-pinene': 0.0023,
      humulene: 0.0023,
      linalool: 0.0018,
      'α-bisabolol': 0.0011,
      eucalyptol: 0.0005,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #9',
  },
  {
    name: 'Super Silver Haze Live Resin Diamonds',
    productType: 'concentrate',
    concentrateType: 'crystalline',
    subspecies: 'hybridSativa',
    cultivar: 'Super Silver Haze',
    brand: 'Brand #9',
    price: 24,
    weight: 1,
    potency: {thc: 0.88},
    terps: {
      'β-caryophyllene': 0.0064,
      nerolidol: 0.0027,
      'δ-limonene': 0.0027,
      myrcene: 0.0024,
      'β-pinene': 0.0023,
      humulene: 0.0023,
      linalool: 0.0018,
      'α-bisabolol': 0.0011,
      eucalyptol: 0.0005,
      camphene: 0.0002,
      'caryophyllene oxide': 0.0001,
    },
    vendorName: 'Dispensary #9',
  },
]

products.forEach(ProductUtil.read)

const vendors = [
  {
    name: 'Dispensary #1',
    location: {
      address: '10709 N Rockwell Ave Suite A\nOklahoma City, OK 73162',
      plus: 'H9H6+6F Eagle Lake Estates\nOklahoma City, OK',
    },
    contact: {
      tel: '+14057306152',
      url: 'https://linktr.ee/capitaldank',
    },
    schedule: {
      all: '9-17',
      sat: '11:30-20',
      sun: 'closed',
      christmas: 'closed',
    },
    rating: {
      counts: [463, 222, 236, 2425, 8650],
    },
  },
  {
    name: 'Dispensary #4',
    location: {
      address: '504 N Classen Blvd\nOklahoma City, OK 73106',
      plus: 'FFFC+2J Midtown\nOklahoma City, OK',
    },
    contact: {
      tel: '+14056737611',
    },
    schedule: {
      all: '11-21',
      mon: 'closed',
      sat: '9-21',
      sun: '9-21',
      thanksgiving: 'closed',
      'thanksgiving+1': '9-21',
      'thanksgiving+2': '9-21',
      'thanksgiving+3': '9-21',
      'christmas-1': 'closed',
      christmas: 'closed',
    },
    rating: {
      counts: [313, 232, 335, 1347, 6573],
    },
  },
  {
    name: 'Dispensary #3',
    location: {
      address: '3641 NW 63rd St\nOklahoma City, OK 73116',
      plus: 'GCP8+RQ Central Oklahoma City\nOklahoma City, OK',
    },
    contact: {
      tel: '+14052426410',
    },
    schedule: {
      all: '9-18',
      sat: 'closed',
      sun: 'closed',
      'newYears-1': 'closed',
      newYears: 'closed',
      mlk: 'closed',
      presidents: 'closed',
      columbus: 'closed',
      thanksgiving: 'closed',
      christmas: 'closed',
    },
    rating: {
      counts: [822, 784, 880, 4920, 14291],
    },
  },
  {
    name: 'Dispensary #2',
    location: {
      address: '7825 NE 23rd St\nOklahoma City, OK 73141',
      plus: 'FJV5+HQ Spencer, Oklahoma',
    },
    contact: {
      tel: '+14054939042',
      url: 'https://firedepotdispensary.com/',
    },
    schedule: {
      all: '0-0',
      thanksgiving: 'closed',
      christmas: 'closed',
    },
  },
  {
    name: 'Dispensary #5',
    location: {
      address: '5401 NW 23rd St\nOklahoma City, OK 73127',
      plus: 'F9VP+CX Central Oklahoma City\nOklahoma City, OK',
    },
    contact: {
      tel: '+14059214302',
    },
    schedule: {
      all: '9-19',
      sat: '10-22',
      sun: '10-17',
      mon: 'closed',
    },
    rating: {
      counts: [415, 490, 280, 2599, 18204],
    },
  },
  {
    name: 'Dispensary #6',
    location: {
      address: '10116 NW 10th St\nOklahoma City, OK 73127',
      plus: 'F8H2+8H Southwest Oklahoma City\nOklahoma City, OK',
    },
    contact: {
      tel: '+14054674621',
    },
    schedule: {
      all: '12-22',
      sat: '10:30-2:30',
      sun: '10:30-17',
    },
    rating: {
      counts: [84, 102, 77, 240, 451],
    },
  },
  {
    name: 'Dispensary #7',
    location: {
      address: '2130 NW 40th St\nOklahoma City, OK 73112',
      plus: 'GF72+4G Central Oklahoma City\nOklahoma City, OK',
    },
    operatingStatus: 'permanentlyClosed',
  },
  {
    name: 'Dispensary #8',
    location: {
      address: '300 NW 63rd St\nOklahoma City, OK 73116',
      plus: 'GFPJ+JP Central Oklahoma City\nOklahoma City, OK',
    },
    contact: {
      tel: '+14056084372',
    },
    schedule: {
      all: '12-0',
      sat: '10-1:30',
      sun: 'closed',
    },
    rating: {
      counts: [180, 190, 185, 225, 510],
    },
  },
  {
    name: 'Dispensary #9',
    location: {
      address: '7221 S Western Ave\nOklahoma City, OK 73139',
      plus: '9FV9+HJ Central Oklahoma City\nOklahoma City, OK',
    },
    contact: {
      tel: '+14054939609',
    },
    schedule: {
      all: '12-19:30',
      sat: '10:45-19:30',
      sun: '10:45-17',
    },
    rating: {
      counts: [725, 440, 811, 5251, 16900],
    },
  },
]

vendors.forEach(VendorUtil.read)

export default {products, vendors}
