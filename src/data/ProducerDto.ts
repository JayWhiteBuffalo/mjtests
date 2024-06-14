import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import {prisma} from '@/db'
import UserDto from '@data/UserDto'
import {nanoid} from 'nanoid'
import { hasAdminPermission, hasSalesPermission, hasOwnerPermission, hasManagerPermission } from '@/util/Roles'

const ProducerDto = {
  async canSee(user, producerId) {
    if (hasAdminPermission(user.roles) || hasSalesPermission(user.roles) || hasOwnerPermission(user.roles) || hasManagerPermission(user.roles)) {
      return true
    }
    // if (user.roles.includes('sales')) {
    //   return true
    // }
    const producer = await ProducerDto._getRaw(producerId)
    if (producer.signupStatus.complete) {
      return true
    }

    return false
  },

  async canEdit(user, producerId) {
    if (hasAdminPermission(user.roles) || hasOwnerPermission(user.roles)) {
      return true
    }
    const producer = await ProducerDto._getRaw(producerId)
    if (!producer) {
      return false
    }
    if (user.producers.some(edge => edge.producerId === producer.id)) {
      return true
    }
    return false
  },

  async canCreate(user) {
    if (hasAdminPermission(user.roles) || hasSalesPermission(user.roles) || hasOwnerPermission(user.roles) || hasManagerPermission(user.roles)) {
      return true
    }
    // if (user.roles.includes('sales')) {
    //   return true
    // }
    return false
  },

  async _getRaw(producerId) {
    return await prisma.producer.findUnique({
      where: {id: producerId},
    })
  },

  async findMany(options) {
    options ??= {}
    options.orderBy ??= {name: 'asc'}
    const user = await UserDto.getCurrent()
    const rawProducers = await prisma.producer.findMany(options)
    return await ArrayUtil.asyncFilter(rawProducers, raw =>
      ProducerDto.canSee(user, raw.id),
    )
  },

  async get(producerId) {
    const user = await UserDto.getCurrent()
    if (!(await ProducerDto.canSee(user, producerId))) {
      return null
    }
    return await ProducerDto._getRaw(producerId)
  },

  async createOrUpdate(producerId, producer) {
    const user = await UserDto.getCurrent()

    if (producerId) {
      assert(await ProducerDto.canEdit(user, producerId))
      await prisma.producer.update({
        where: {id: producerId},
        data: {
          ...producer,
          updatedById: user.id,
          version: {increment: 1},
        },
      })
      return producerId
    } else {
      assert(await ProducerDto.canCreate(user))
      const id = nanoid()
      await prisma.producer.createMany({
        data: [
          {
            ...producer,
            flags: {},  // Ensure flags is included and is a valid JSON object
            id,
            createdById: user.id,
            updatedById: user.id,
            slug: id,
            signupStatus: {}  // Ensure signupStatus is included and is a valid JSON object
          },
        ],
      })
      return id
    }
  },
}

export default ProducerDto
