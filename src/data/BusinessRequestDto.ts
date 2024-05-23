import ArrayUtil from '@util/ArrayUtil'
import assert from 'assert'
import UserDto from '@data/UserDto'
import {prisma} from '@/db'
import {nanoid} from 'nanoid'

const BusinessRequestDto = {
  async canSee(user, requestId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }

    const request = await BusinessRequestDto._getRaw(requestId)
    if (request.createdById === user.id && !request.archived) {
      return true
    }
    return false
  },

  async canCreate(user) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    if (user.loggedIn) {
      return true
    }
    return false
  },

  async canEdit(user, _requestId) {
    if (user.roles.includes('admin')) {
      return true
    }
    if (user.roles.includes('sales')) {
      return true
    }
    return false
  },

  async _getRaw(requestId) {
    return await prisma.businessRequest.findUnique({
      where: {id: requestId},
    })
  },

  async findMany(options) {
    const user = await UserDto.getCurrent()
    const rawRequests = await prisma.businessRequest.findMany(options)
    return await ArrayUtil.asyncFilter(rawRequests, raw =>
      BusinessRequestDto.canSee(user, raw.id),
    )
  },

  async get(requestId) {
    const user = await UserDto.getCurrent()
    if (!(await BusinessRequestDto.canSee(user, requestId))) {
      return null
    }
    return await BusinessRequestDto._getRaw(requestId)
  },

  async create(request) {
    const user = await UserDto.getCurrent()
    assert(await BusinessRequestDto.canCreate(user))
    const id = nanoid()
    await prisma.businessRequest.createMany({
      data: [
        {
          ...request,
          id,
          createdById: user.id,
          updatedById: user.id,
        },
      ],
    })
    return id
  },

  async update(requestId, request) {
    const user = await UserDto.getCurrent()
    assert(await BusinessRequestDto.canEdit(user, requestId))
    return await prisma.businessRequest.update({
      where: {id: requestId},
      data: {
        ...request,
        updatedById: user.id,
        version: {increment: 1},
      },
    })
  },
}

export default BusinessRequestDto
