'use client'
import {BlueLink} from '@components/Link'
import {TableCell} from '@nextui-org/react'
import {TMTable, makeColumns} from '@components/Table'

const NameCell = ({item: user}) =>
  <TableCell className="p-4">
    <BlueLink href={`/admin/users/${user.id}`}>{user.name}</BlueLink>
  </TableCell>

const RolesCell = ({value: roles}) =>
  <TableCell className="p-4">
    {roles.join(', ')}
  </TableCell>

export const UserTable = ({users}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', cell: NameCell},
    {key: 'email', label: 'Email'},
    {key: 'roles', label: 'Roles', Cell: RolesCell},
  ])

  return <TMTable columns={columns} items={users} />
}
