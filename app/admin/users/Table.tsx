'use client'
import {TMTable, makeColumns} from '@components/Table'
import {Table} from 'flowbite-react'
import {BlueLink} from '@components/Link'

const NameCell = ({item: user}) =>
  <Table.Cell className="p-4">
    <BlueLink href={`/admin/users/${user.id}`}>{user.name}</BlueLink>
  </Table.Cell>

const RolesCell = ({value: roles}) =>
  <Table.Cell className="p-4">
    {roles.join(', ')}
  </Table.Cell>

export const UserTable = ({users}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', cell: NameCell},
    {key: 'email', label: 'Email'},
    {key: 'roles', label: 'Roles', Cell: RolesCell},
  ])

  return <TMTable columns={columns} items={users} />
}
