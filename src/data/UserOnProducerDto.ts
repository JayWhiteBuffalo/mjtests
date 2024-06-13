import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import UserDto from '@data/UserDto'
import {prisma} from '@/db'
import { Permission, hasAdminPermission, hasOwnerPermission, hasSalesPermission } from '@/util/Roles'

const UserOnProducerDto = {
  async canSee(user, _userId, producerId) {
    if (hasAdminPermission(user.roles) ||
    hasOwnerPermission(user.roles) ||
    hasSalesPermission(user.roles)) {
      return true
    }

    if (
      user.producers.some(
        edge => edge.producerId === producerId && edge.role === 'admin',
      )
    ) {
      return true
    }

    return false
  },

  async canEdit(user, _userId, producerId) {
    if (hasAdminPermission(user.roles) ||
    hasOwnerPermission(user.roles) ||
    hasSalesPermission(user.roles)) {
      return true
    }

    if (
      user.producers.some(
        edge => edge.producerId === producerId && edge.role === 'admin',
      )
    ) {
      return true
    }

    return false
  },

  async canCreate(user, _userId, producerId) {
    if (hasAdminPermission(user.roles) ||
    hasOwnerPermission(user.roles) ||
    hasSalesPermission(user.roles)) {
      return true
    }

    // No invitation required for now
    if (
      user.producers.some(
        edge => edge.producerId === producerId && edge.role === 'admin',
      )
    ) {
      return true
    }
    return false
  },

  async _getRaw(userId, producerId) {
    return await prisma.userOnProducer.findUnique({
      where: {userId, producerId},
    })
  },

  async findMany(options) {
    const user = await UserDto.getCurrent()
    const rawUserOnProducers = await prisma.userOnProducer.findMany(options)
    return await ArrayUtil.asyncFilter(rawUserOnProducers, edge =>
      UserOnProducerDto.canSee(user, edge.userId, edge.producerId),
    )
  },

  async get(userId, producerId) {
    const user = await UserDto.getCurrent()
    if (!(await UserOnProducerDto.canSee(user, userId, producerId))) {
      return null
    }
    return await UserOnProducerDto._getRaw(userId, producerId)
  },

  async create(edge) {
    const user = await UserDto.getCurrent()
    assert(await UserOnProducerDto.canCreate(user))
    return void (await prisma.userOnProducer.createMany({data: [edge]}))
  },

  async update(edge) {
    const user = await UserDto.getCurrent()
    assert(await UserOnProducerDto.canEdit(user, edge.userId, edge.producerId))
    return await prisma.userOnProducer.update({
      where: {userId: edge.userId, producerId: edge.producerId},
      data: edge,
    })
  },
}

export default UserOnProducerDto
