import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'
import {GiBarn} from 'react-icons/gi'
import {HiInbox, HiShoppingBag, HiUser, HiHome} from 'react-icons/hi'
import {HiMiniBuildingStorefront} from 'react-icons/hi2'
import {LuBinary} from 'react-icons/lu'

export const homePage = {
  name: 'Home',
  Icon: HiHome,
}
export const rootPages = [
  {
    name: 'Apply',
    Icon: HiUser,
  },
  {
    name: 'Products',
    Icon: HiShoppingBag,
  },
  {
    name: 'Vendors',
    Icon: HiMiniBuildingStorefront,
  },
  {
    name: 'Producers',
    Icon: GiBarn,
  },
  {
    name: 'Requests',
    Icon: HiInbox,
  },
  {
    name: 'Users',
    Icon: HiUser,
  },
  {
    name: 'Dev Tools',
    key: 'dev',
    Icon: LuBinary,
  },
]

const populateRootPage = (page, index) => {
  page.key ??= StringUtil.toLowerCamel(page.name)
  page.segment ??= page.key
  page.index = index
}
rootPages.forEach(populateRootPage)
export const rootPagesByKey = ObjectUtil.fromIterable(rootPages, x => x.key)

export const getRootPageRouteItem = key => rootPagesByKey[key]

export const canUseAdmin = user => {
  if (user.roles.includes('admin')) {
    return true
  }
  if (user.roles.includes('vendor')) {
    return true
  }
  if (user.roles.includes('producer')) {
    return true
  }
  //if (user.loggedIn && process.env.NODE_ENV === 'development') {
  if (user.loggedIn) {
    return true
  }
  return false
}

const pagesCanUse = {
  apply: user => {
    if (user.loggedIn) {
      return true
    }
    return false
  },

  dev: user => {
    if (user.roles.includes('admin')) {
      return true
    }

    //if (user.loggedIn && process.env.NODE_ENV === 'development') {
    if (user.loggedIn) {
      return true
    }
    return false
  },

  producers: user => {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.roles.includes('producer')) {
      if (user.producers.some(edge => edge.role === 'admin')) {
        return true
      }
    }
    return false
  },

  products: user => {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.roles.includes('vendor')) {
      return true
    }
    if (user.roles.includes('producer')) {
      return true
    }
    return false
  },

  requests: user => {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    return false
  },

  users: user => {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.roles.includes('vendor')) {
      if (user.vendors.some(edge => edge.role === 'admin')) {
        return true
      }
    }
    return false
  },

  vendors: user => {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.roles.includes('vendor')) {
      if (user.vendors.some(edge => edge.role === 'admin')) {
        return true
      }
    }
    return false
  },
}

export const canUseRootPage = (user, pageName) => pagesCanUse[pageName](user)
