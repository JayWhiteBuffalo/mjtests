import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'
import {GiBarn} from 'react-icons/gi'
import {HiInbox, HiShoppingBag, HiUser, HiHome} from 'react-icons/hi'
import {HiMiniBuildingStorefront} from 'react-icons/hi2'
import { FaBagShopping } from "react-icons/fa6";
import {LuBinary} from 'react-icons/lu'
import { Permission, hasPermission, hasAdminPermission, hasOwnerPermission, hasManagerPermission, hasSalesPermission, hasEmployeePermission, isVendor, isProducer } from '@/util/Roles';
import {Icon} from '@iconify/react/dist/iconify.js'

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
  {
    name: 'Shop',
    key: 'shop',
    Icon: FaBagShopping,
  }
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
          hasEmployeePermission(userPermission) ||
          hasPermission(userPermission, Permission.GUEST)
      ) {
    return true
  }


}

const pagesCanUse = {
  apply: user => {
    if (user.loggedIn && !hasPermission(user.roles, Permission.VENDOR_EMPLOYEE) ) {
      return true
    }
    return false
  },

  dev: user => {
        if (hasAdminPermission(user.roles))  {
    return true
  }

  },

  producers: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) ||
           isVendor(userPermission) ||
           isProducer(userPermission) ||
           hasSalesPermission(userPermission)||
           hasManagerPermission(userPermission)
  },

  products: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) ||
           isVendor(userPermission) ||
           isProducer(userPermission) ||
           hasSalesPermission(userPermission)
  },

  requests: user => {
    const userPermission = user.roles;
    return hasAdminPermission(userPermission) 
          //  hasOwnerPermission(userPermission) ||
          //  hasManagerPermission(userPermission) ||
          //  hasSalesPermission(userPermission)
  },

  users: user => {
    const userPermission = user.roles;
    if (hasAdminPermission(userPermission) ) {
      return true
    }
    return  hasOwnerPermission(userPermission) ||
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

  shop: user => {
    if (user.loggedIn ) {
      return true
    }
    return false
  },
  
}

  export const canUseRootPage = (user, pageName) => {
    const pagePermissionCheck = pagesCanUse[pageName];
    if (pagePermissionCheck) {
      return pagePermissionCheck(user);
    }
    return false;
  }
  


