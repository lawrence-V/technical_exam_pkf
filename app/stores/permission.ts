import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Permission Store
 * Manages the global state of user permissions.
 */
export type UserRole = 'Admin' | 'HR' | 'Employee' | 'Guest'

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: ['employee.view', 'employee.update', 'employee.delete', 'payroll.view', 'payroll.update', 'settings.manage'],
  HR: ['employee.view', 'employee.update', 'payroll.view'],
  Employee: ['employee.view'],
  Guest: []
}

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<string[]>(ROLE_PERMISSIONS.Admin)
  const currentRole = ref<UserRole>('Admin')

  const setPermissions = (newPermissions: string[]) => {
    permissions.value = newPermissions
  }

  const switchRole = (role: UserRole) => {
    currentRole.value = role
    permissions.value = [...ROLE_PERMISSIONS[role]]
  }

  return {
    permissions,
    currentRole,
    setPermissions,
    switchRole
  }
})
