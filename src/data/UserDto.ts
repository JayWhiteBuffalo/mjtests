import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import supabase from '@api/supabaseServer'
import { prisma } from '@/db'
import { Permission, hasAdminPermission, hasOwnerPermission, hasSalesPermission, hasManagerPermission } from '@/util/Roles'

const userCache = new Map()

const UserDto = {
  async getCurrent() {
    if (userCache.has('current')) {
      return userCache.get('current')
    }

    const authUser = (await supabase().auth.getUser()).data?.user
    if (authUser) {
      const user = await this._getRaw(authUser.id)
      if (user) {
        user.loggedIn = true
        user.authUser = authUser
        userCache.set('current', user)
        return user
      }
    }

    return {
      loggedIn: false,
      producers: [],
      roles: [],
      vendors: [],
    }
  },

  async canSee(currentUser, userId) {
    if (
      hasAdminPermission(currentUser.roles) ||
      hasOwnerPermission(currentUser.roles) ||
      hasSalesPermission(currentUser.roles)
    ) {
      return true
    }

    if (currentUser.id === userId) {
      return true
    }

    const otherUser = await this._getRaw(userId)
    const otherVendorIds = new Set(otherUser.vendors.map(edge => edge.vendorId))

    return currentUser.vendors
      .filter(edge => hasAdminPermission(edge.role))
      .some(edge => otherVendorIds.has(edge.vendorId))
  },

  async canCreate(user) {
    return hasAdminPermission(user.roles) || hasSalesPermission(user.roles) || hasOwnerPermission(user.roles)
  },

  async canEdit(currentUser, userId) {
    return (
      hasAdminPermission(currentUser.roles) ||
      hasOwnerPermission(currentUser.roles) ||
      currentUser.id === userId
    )
  },

  async canDelete(currentUser) {
    return hasAdminPermission(currentUser.roles) || hasOwnerPermission(currentUser.roles)
  },

  async _getRaw(userId) {
    // Check the cache first
    if (userCache.has(userId)) {
      return userCache.get(userId)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vendors: true, producers: true },
    })

    if (user) {
      userCache.set(userId, user)
    }

    return user
  },

  async get(userId) {
    const currentUser = await this.getCurrent()
    if (!(await this.canSee(currentUser, userId))) {
      return null
    }
    return this._getRaw(userId)
  },

  async getByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user && this.get(user.id)
  },

  async findMany(options) {
    options ??= {}
    options.orderBy ??= { name: 'asc' }

    const currentUser = await this.getCurrent()
    const rawUsers = await prisma.user.findMany(options)

    const users = await ArrayUtil.asyncFilter(rawUsers, async raw =>
      this.canSee(currentUser, raw.id)
    )

    // Cache users for further requests
    users.forEach(user => userCache.set(user.id, user))

    return users
  },

  async create(userData, currentUser) {
    assert(await this.canCreate(currentUser), 'Permission denied')

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        createdBy: currentUser.id,
      },
    })

    console.log(newUser)
    return newUser
  },

  async update(userId, userData) {
    const currentUser = await this.getCurrent()
    assert(await this.canEdit(currentUser, userId), 'Permission denied')

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    })

    userCache.set(userId, updatedUser)
    return updatedUser
  },

  async delete(userId) {
    const currentUser = await this.getCurrent()
    assert(await this.canDelete(currentUser), 'Permission denied')

    return await prisma.$transaction(async prisma => {
      await prisma.userOnVendor.deleteMany({ where: { userId } })
      await prisma.userOnProducer.deleteMany({ where: { userId } })
      await prisma.businessRequest.deleteMany({ where: { createdById: userId } })
      await prisma.user.delete({ where: { id: userId } })

      userCache.delete(userId)

      console.log(`User with ID ${userId} and associated records successfully deleted.`)
    })
  },
}

export default UserDto
