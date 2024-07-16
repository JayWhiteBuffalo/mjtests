'use client'
import { BlueLink } from '@/feature/shared/component/Link'
import { TMTable, makeColumns, ActionHeaderCell } from '@/feature/shared/component/Table'
import { hasAdminPermission, hasOwnerPermission, renderUserRoles } from '@/util/Roles'
import { Button, Link } from '@nextui-org/react'
import { PERMISSIONS } from '@/util/Roles'

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
      console.error(response)
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

const NameCell = ({ item: user }) => (
  <BlueLink href={`/admin/users/${user.id}`}>{user.name}</BlueLink>
)

const ActionCell = ({ item: { id } }) => (
  <BlueLink href={`/admin/users/${id}/edit`} className="font-medium">
    Edit
  </BlueLink>
)

const DeleteCell = ({ item: user, currentUser, onDelete }) => (
  // Ensure that the delete button is only shown if the user being displayed is not the current user
  user.id !== currentUser.id && (
    <Button
      color="danger"
      onClick={() => onDelete(user.id)}
      size="sm"
    >
      Delete
    </Button>
  )
)

const RolesCell = ({ item: user }) => (
  <span>
    {user.roles.map(role => PERMISSIONS[role]?.role).join(', ')}
  </span>
);

export const UserTable = ({ users, userPermission, currentUser }) => {
  const onDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      console.error('Cannot delete your own profile');
      return;
    }
    deleteUser(userId);
  };

  const columns = makeColumns([
    { key: 'name', label: 'Name', Cell: NameCell },
    { key: 'email', label: 'Email' },
    { key: 'roles', label: 'Roles', Cell: RolesCell },
    // { key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell },
    { key: 'delete', HeaderCell: ActionHeaderCell, Cell: (props) => <DeleteCell {...props} currentUser={currentUser} onDelete={deleteUser} /> },
  ])

  return (
    <>
      {hasAdminPermission(userPermission) || hasOwnerPermission(userPermission) ?
        (<ActionBar />) : (null)
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
