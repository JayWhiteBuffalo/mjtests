'use client'
import {BlueLink} from '@/feature/shared/component/Link'
import {TMTable, makeColumns} from '@/feature/shared/component/Table'
import {Button} from '@nextui-org/react'
import UserDto from '@/data/UserDto'


const NameCell = ({item: user}) => (
  <BlueLink href={`/admin/users/${user.id}`}>{user.name}</BlueLink>

) 

const DeleteUserButtonCell = ({ item: user }) => (
  <Button
  color="danger"
  onClick={async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('User deleted successfully');
        window.location.reload();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }}
  size="sm"
  >
  Delete User
  </Button>
);



const RolesCell = ({value: roles}) => roles.join(', ')

export const UserTable = ({users}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'email', label: 'Email'},
    {key: 'roles', label: 'Roles', Cell: RolesCell},
    {key: 'actions', label: 'Actions', Cell: DeleteUserButtonCell }
  ])

  return <TMTable aria-label="Table of users" columns={columns} items={users} />
}
