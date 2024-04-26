'use client'
import {BlueLink} from '@components/Link'
import {TMTable, makeColumns} from '@components/Table'

const NameCell = ({item: user}) =>
  <BlueLink href={`/admin/users/${user.id}`}>{user.name}</BlueLink>

const RolesCell = ({value: roles}) =>
  roles.join(', ')

export const UserTable = ({users}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', cell: NameCell},
    {key: 'email', label: 'Email'},
    {key: 'roles', label: 'Roles', Cell: RolesCell},
  ])

  return (
    <TMTable
      aria-label="Table of users"
      columns={columns}
      items={users} 
    />
  )
}
