
export enum Permission {
    SUPER_ADMIN = '1',
    ADMIN = '2',
    DEV = '3',
    PRODUCER_OWNER = '4',
    VENDOR_OWNER = '5',
    PRODUCER_MANAGER = '6',
    VENDOR_MANAGER = '7',
    PRODUCER_EMPLOYEE = '8',
    VENDOR_EMPLOYEE = '9',
    USER = '10',
    GUEST = '11',
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

export function hasPermission(userPermission: Permission, requiredPermission: Permission): boolean {
    // Compare the numeric values of the permissions
    return parseInt(userPermission) <= parseInt(requiredPermission);
}

export function hasRole(userPermission: Permission, requiredPermission: Permission): boolean {
    return parseInt(userPermission) === parseInt(requiredPermission);
}

