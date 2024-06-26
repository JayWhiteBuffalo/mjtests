'use client'
import {BlueLink} from '@/feature/shared/component/Link'
import {TMTable, makeColumns, ActionHeaderCell} from '@/feature/shared/component/Table'
import {hasAdminPermission, hasOwnerPermission} from '@/util/Roles'
import {Button, Link} from '@nextui-org/react'

const deleteUser = async (userId) => {
  try {
        const response = await fetch(`/api/users/${userId}`, {
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
  }

const NameCell = ({item: user}) => (
  <BlueLink href={`/admin/users/${user.id}`}>{user.name}</BlueLink>

) 

const ActionCell = ({item: {id}}) => (
  <BlueLink href={`/admin/users/${id}/edit`} className="font-medium">
    Edit
  </BlueLink>
)

const DeleteCell = ({ item: user }) => (
  <Button
    color="danger"
    onClick={() => deleteUser(user.id)}
    size="sm"
  >
    Delete
  </Button>
)


const RolesCell = ({value: roles}) => roles.join(', ')

export const UserTable = ({users, userPermission}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'email', label: 'Email'},
    {key: 'roles', label: 'Roles', Cell: RolesCell},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
    {key: 'delete', HeaderCell: ActionHeaderCell, Cell: DeleteCell},
  ])

  return (
    <>
    {hasAdminPermission(userPermission) || hasOwnerPermission(userPermission) ? 
    (<ActionBar/>) : (null)
    }
      <TMTable aria-label="Table of users" columns={columns} items={users} />
    </>
  ) 
}


const ActionBar = () => (
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/users/create`}>
      <Button>Add User</Button>
    </Link>
  </div>
)