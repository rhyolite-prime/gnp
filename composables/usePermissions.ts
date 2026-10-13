import { useAdminAuthStore } from '~/stores/admin-auth'



export function usePermissions() {
  const authStore = useAdminAuthStore()

  /**
   * Check if the currently authenticated user has the required permission(s).
   * @param permissionId Single permission string or array of permission strings
   * @param requireAll If true, user must have ALL provided permissions. If false (default), user only needs ONE.
   */
  const hasPermission = (permissionId: string | string[], requireAll: boolean = false): boolean => {
    // If no permission is required, return true
    if (!permissionId || (Array.isArray(permissionId) && permissionId.length === 0)) {
      return true
    }

    const userPermissions = authStore.permissions || []
    
    // Super-admin override: includes "*" grants full access
    if (userPermissions.includes('*')) {
      return true
    }

    if (Array.isArray(permissionId)) {
      if (requireAll) {
        return permissionId.every(id => userPermissions.includes(id))
      }
      return permissionId.some(id => userPermissions.includes(id))
    }

    return userPermissions.includes(permissionId)
  }

  /**
   * Helper to get a human-readable label for a permission ID
   */
  const getPermissionLabel = (permId: string): string => {
    return permId
  }

  return {
    hasPermission,
    getPermissionLabel
  }
}
