import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'
import {GiBarn} from 'react-icons/gi'
import {HiInbox, HiShoppingBag, HiUser, HiHome} from 'react-icons/hi'
import {HiMiniBuildingStorefront} from 'react-icons/hi2'
import {LuBinary} from 'react-icons/lu'
import { Permission, hasPermission, hasAdminPermission, hasOwnerPermission, hasManagerPermission, hasSalesPermission, hasEmployeePermission, isVendor, isProducer } from '@/util/Roles';

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

  const userPermission = user.roles;

      if (userPermission.includes('admin') ||
          hasAdminPermission(userPermission) ||
          hasSalesPermission(userPermission)||
          hasOwnerPermission(userPermission) ||
          hasManagerPermission(userPermission) ||
          hasEmployeePermission(userPermission)
      ) {
    return true
  }


}

const pagesCanUse = {
  apply: user => {
    if (user.loggedIn) {
      return true
    }
    return false
  },

  dev: user => {
    const userPermission = user.roles;
        if (user.roles.includes('admin')) {
    return true
  }
    return hasPermission(userPermission, Permission.GUEST);
  },

  producers: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) ||
           isVendor(userPermission) ||
           isProducer(userPermission) ||
           hasSalesPermission(userPermission)
  },

  products: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) ||
           hasOwnerPermission(userPermission) ||
           hasManagerPermission(userPermission) ||
           hasSalesPermission(userPermission)
  },

  requests: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) ||
           hasOwnerPermission(userPermission) ||
           hasManagerPermission(userPermission) ||
           hasSalesPermission(userPermission)
  },

  users: user => {
    const userPermission = user.roles;
    if (user.roles.includes('admin')) {
      return true
    }
    return hasAdminPermission(userPermission) ||
           hasOwnerPermission(userPermission) ||
           hasManagerPermission(userPermission) ||
           hasSalesPermission(userPermission)
  },

  vendors: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) ||
           hasOwnerPermission(userPermission) ||
           hasManagerPermission(userPermission) ||
           hasSalesPermission(userPermission)
  },
}

  export const canUseRootPage = (user, pageName) => {
    const pagePermissionCheck = pagesCanUse[pageName];
    if (pagePermissionCheck) {
      return pagePermissionCheck(user);
    }
    return false;
  }
  
  //   if (user.roles.includes('admin')) {
//     return true
//   }
//   if (user.roles.includes('vendor')) {
//     return true
//   }
//   if (user.roles.includes('producer')) {
//     return true
//   }
//   //if (user.loggedIn && process.env.NODE_ENV === 'development') {
//   if (user.loggedIn) {
//     return true
//   }
//   return false

  // dev: user => {
  //   if (user.roles.includes('admin')) {
  //     return true
  //   }

    //if (user.loggedIn && process.env.NODE_ENV === 'development') {
  //   if (user.loggedIn) {
  //     return true
  //   }
  //   return false
  // },

  // producers: user => {
  //   if (user.roles.includes('admin')) {
  //     return true
  //   }
  //   if (user.roles.includes('sales')) {
  //     return true
  //   }
  //   if (user.roles.includes('producer')) {
  //     if (user.producers.some(edge => edge.role === 'admin')) {
  //       return true
  //     }
  //   }
  //   return false
  // },

  // products: user => {
  //   if (user.roles.includes('admin')) {
  //     return true
  //   }
  //   if (user.roles.includes('sales')) {
  //     return true
  //   }
  //   if (user.roles.includes('vendor')) {
  //     return true
  //   }
  //   if (user.roles.includes('producer')) {
  //     return true
  //   }
  //   return false
  // },

  // requests: user => {
  //   if (user.roles.includes('admin')) {
  //     return true
  //   }
  //   if (user.roles.includes('sales')) {
  //     return true
  //   }
  //   return false
  // },

  // users: user => {
  //   if (user.roles.includes('admin')) {
  //     return true
  //   }
  //   if (user.roles.includes('sales')) {
  //     return true
  //   }
  //   if (user.roles.includes('vendor')) {
  //     if (user.vendors.some(edge => edge.role === 'admin')) {
  //       return true
  //     }
  //   }
  //   return false
  // },

  // vendors: user => {
  //   if (user.roles.includes('admin')) {
  //     return true
  //   }
  //   if (user.roles.includes('sales')) {
  //     return true
  //   }
  //   if (user.roles.includes('vendor')) {
  //     if (user.vendors.some(edge => edge.role === 'admin')) {
  //       return true
  //     }
  //   }
  //   return false
  // },
//}

// export const canUseRootPage = (user, pageName) => pagesCanUse[pageName](user)

