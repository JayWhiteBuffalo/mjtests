import {permission} from 'process'

export enum Permission {
    SUPER_ADMIN = '1',
    ADMIN = '2',
    DEV = '3',
    SALES = '4',
    PRODUCER_OWNER = '5',
    VENDOR_OWNER = '6',
    PRODUCER_MANAGER = '7',
    VENDOR_MANAGER = '8',
    PRODUCER_EMPLOYEE = '9',
    VENDOR_EMPLOYEE = '10',
    USER = '11',
    GUEST = '12',
    // ... (other permissions)

}

interface PermissionObject {
    name: Permission;
    role: string,
    path: string[];
}

export const PERMISSIONS: Record<Permission, PermissionObject> = {
    [Permission.SUPER_ADMIN]: {
        name: Permission.SUPER_ADMIN,
        role: 'SUPER_ADMIN',
        path: ['/*'],
    },
    [Permission.ADMIN]: {
        name: Permission.ADMIN,
        role: 'ADMIN',
        path: ['/*'],
    },
    [Permission.DEV]: {
        name: Permission.DEV,
        role: 'DEV',
        path: ['/*'],
    },    
    [Permission.SALES]: {
        name: Permission.SALES,
        role: 'SALES',
        path: ['/*'],
    },
    [Permission.PRODUCER_OWNER]: {
        name: Permission.PRODUCER_OWNER,
        role: 'PRODUCER_OWNER',
        path: [''],
    },
    [Permission.VENDOR_OWNER]: {
        name: Permission.VENDOR_OWNER,
        role: 'VENDOR_OWNER',
        path: [''],
    },
    [Permission.PRODUCER_MANAGER]: {
        name: Permission.PRODUCER_MANAGER,
        role: 'PRODUCER_MANAGER',
        path: [''],
    },
    [Permission.VENDOR_MANAGER]: {
        name: Permission.VENDOR_MANAGER,
        role: 'VENDOR_MANAGER',
        path: [''],
    },
    [Permission.PRODUCER_EMPLOYEE]: {
        name: Permission.PRODUCER_EMPLOYEE,
        role: 'PRODUCER_EMPLOYEE',
        path: [],
    },
    [Permission.VENDOR_EMPLOYEE]: {
        name: Permission.VENDOR_EMPLOYEE,
        role: 'VENDOR_EMPLOYEE',
        path: [],
    },
    [Permission.USER]: {
        name: Permission.USER,
        role: 'USER',
        path: [],
    },
    [Permission.GUEST]: {
        name: Permission.GUEST,
        role: 'GUEST',
        path: [],
    },
};

export const renderUserRoles = (permissions) => {
    return permissions.map(permission => PERMISSIONS[permission].role).join(', ');
};

export function hasPermission(userPermission: Permission[], requiredPermission: Permission): boolean {
    // Compare the numeric values of the permissions
    return userPermission.some(permission => parseInt(permission) <= parseInt(requiredPermission));
}

export function hasRole(userPermission: Permission[], requiredPermission: Permission): boolean {
    return userPermission.some(permission => requiredPermission.includes(permission));
}

export function hasAdminPermission(userPermission: Permission[]): boolean {
    const adminPermissions = [Permission.SUPER_ADMIN, Permission.ADMIN, Permission.DEV];
    console.log('Checking Admin permission:', userPermission, adminPermissions);
    console.log(renderUserRoles(userPermission))
    return userPermission.some(permission => adminPermissions.includes(permission));
}

export function hasSalesPermission(userPermission: Permission[]): boolean {
    const salesPermissions = [Permission.SALES];
    return userPermission.some(permission => salesPermissions.includes(permission));
}

export function hasOwnerPermission(userPermission: Permission[]): boolean {
    const ownerPermission = [Permission.PRODUCER_OWNER, Permission.VENDOR_OWNER];
    console.log('Checking Owner permission:', userPermission, ownerPermission);
    return userPermission.some(permission => ownerPermission.includes(permission));
}

export function hasManagerPermission(userPermission: Permission[]): boolean {
    const managerPermission = [Permission.PRODUCER_MANAGER, Permission.VENDOR_MANAGER];
    console.log('Checking Manager permission:', userPermission, managerPermission);
    return userPermission.some(permission => managerPermission.includes(permission));
}

export function hasEmployeePermission(userPermission: Permission[]): boolean {
    const employeePermission = [Permission.PRODUCER_EMPLOYEE, Permission.VENDOR_EMPLOYEE];
    return userPermission.some(permission => employeePermission.includes(permission));
}

export function isVendor(userPermission: Permission[]): boolean {
    const vendorRoles = [Permission.VENDOR_OWNER, Permission.VENDOR_MANAGER, Permission.VENDOR_EMPLOYEE];
    console.log('Checking if user is on Vendor account', userPermission, vendorRoles);
    return userPermission.some(permission => vendorRoles.includes(permission))
}

export function isProducer(userPermission: Permission[]): boolean {
    const producerRoles = [Permission.PRODUCER_OWNER, Permission.PRODUCER_MANAGER, Permission.PRODUCER_EMPLOYEE];
    console.log('Checking if user is on Producer account', userPermission, producerRoles);
    return userPermission.some(permission => producerRoles.includes(permission))
}
