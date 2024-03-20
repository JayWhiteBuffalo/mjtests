import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import {auth} from '@/auth'
import {prisma} from '@/db'

const UserDto = {
  async canSee(user, userId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.id === userId) {
      return true
    }

    const otherUser = await UserDto._getRaw(userId)
    const otherVendorIds = new Set(otherUser.vendors.map(edge => edge.vendorId))
    if (
      user.vendors.filter(edge => edge.role === 'admin')
        .some(edge => otherVendorIds.has(edge.vendorId))
    ) {
      return true
    }

    return false
  },

  async canEdit(user, userId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.id === userId) {
      return true
    }
    return false
  },

  async _getRaw(userId) {
    return await prisma.user.findUnique({
      where: {id: userId},
      include: {
        vendors: true,
        producers: true,
      },
    })
  },

  async getCurrent() {
    const session = await auth()
    if (session) {
      const user = await UserDto._getRaw(session.user.id)
      user.loggedIn = true
      return user
    } else {
      return {
        loggedIn: false,
        producers: [],
        roles: [],
        vendors: [],
      }
    }
  },

  async get(userId) {
    const currentUser = await UserDto.getCurrent()
    if (!await UserDto.canSee(currentUser, userId)) {
      return null
    }
    return await UserDto._getRaw(userId)
  },

  async getByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {email},
    })
    return user && UserDto.get(user.id)
  },

  async findMany(options) {
    const currentUser = await UserDto.getCurrent()
    const rawUsers = await prisma.user.findMany(options)
    return await ArrayUtil.asyncFilter(rawUsers, raw => UserDto.canSee(currentUser, raw.id))
  },

  async update(userId, user) {
    const currentUser = await UserDto.getCurrent()
    assert(await UserDto.canEdit(currentUser, userId))
    return await prisma.user.update({
      where: {id: userId},
      data: user,
    })
  },
}

export default UserDto
