import { usePermissionStore } from '~/stores/permission'

/**
 * usePermission Composable
 * Provides helper methods to check for user permissions globally.
 * 
 * @returns { can, canAny, canAll }
 */
export const usePermission = () => {
  const store = usePermissionStore()

  /**
   * Check if the user has a specific permission.
   * @param permissionName The name of the permission (e.g., 'employee.view')
   */
  const can = (permissionName: string): boolean => {
    return store.permissions.includes(permissionName)
  }

  /**
   * Check if the user has any of the listed permissions.
   * @param list Array of permission strings
   */
  const canAny = (list: string[]): boolean => {
    return list.some(permission => store.permissions.includes(permission))
  }

  /**
   * Check if the user has all of the listed permissions.
   * @param list Array of permission strings
   */
  const canAll = (list: string[]): boolean => {
    return list.every(permission => store.permissions.includes(permission))
  }

  return {
    can,
    canAny,
    canAll
  }
}
