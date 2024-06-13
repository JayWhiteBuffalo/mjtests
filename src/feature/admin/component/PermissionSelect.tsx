import { Permission, PERMISSIONS } from '@/util/Roles';
import { DevActionButton } from '@/feature/admin/dev/Pane';
import {useState} from 'react'
import { assignRole } from '@/feature/admin/dev/FormAction';


const PermissionSelect = () => {


    const [role, setRole] = useState<Permission | undefined>(Permission.SUPER_ADMIN);
    // Convert the enum object into an array of its values
    const permissionValues = Object.keys(Permission) as (keyof typeof Permission)[];

      // Handle change event for select input
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value as Permission);
    }
  
    return (
      <div className='flex gap-4'>
        <DevActionButton action={() => assignRole(role)}>Change Role</DevActionButton>
        <select value={role} defaultValue={role} onChange={handleSelectChange}>
          {permissionValues.map(key => (
            <option key={Permission[key]} value={Permission[key]}>
              {PERMISSIONS[Permission[key]].role}
            </option>
          ))}
        </select>
      </div>
    );
  };

  
  export default PermissionSelect;