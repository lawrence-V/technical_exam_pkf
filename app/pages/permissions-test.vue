<script setup lang="ts">
import { usePermissionStore, type UserRole } from '~/stores/permission'
import { usePermission } from '~/composables/usePermission'

const permissionStore = usePermissionStore()
const { can, canAny, canAll } = usePermission()

const roles: UserRole[] = ['Admin', 'HR', 'Employee', 'Guest']

const availablePermissions = [
  'employee.view',
  'employee.update',
  'employee.delete',
  'payroll.view',
  'payroll.update',
  'settings.manage'
]

const togglePermission = (perm: string) => {
  if (permissionStore.permissions.includes(perm)) {
    permissionStore.permissions = permissionStore.permissions.filter(p => p !== perm)
  } else {
    permissionStore.permissions.push(perm)
  }
}
</script>

<template>
  <UContainer class="py-12 max-w-4xl">
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Permission Playground</h1>
        <p class="text-gray-500">Switch roles and toggle permissions to see the UI adapt in real-time.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Configuration Section -->
        <UCard class="h-full">
          <template #header>
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-cog-6-tooth" /> Configuration
            </h2>
          </template>

          <div class="space-y-6">
            <!-- Role Selector -->
            <div>
              <label class="block text-sm font-medium mb-2">Active Role</label>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="role in roles"
                  :key="role"
                  :color="permissionStore.currentRole === role ? 'primary' : 'neutral'"
                  :variant="permissionStore.currentRole === role ? 'solid' : 'outline'"
                  size="sm"
                  @click="permissionStore.switchRole(role)"
                >
                  {{ role }}
                </UButton>
              </div>
            </div>

            <!-- Permission Toggles -->
            <div>
              <label class="block text-sm font-medium mb-2">Individual Toggles</label>
              <div class="grid grid-cols-2 gap-2">
                <UCheckbox
                  v-for="perm in availablePermissions"
                  :key="perm"
                  :model-value="permissionStore.permissions.includes(perm)"
                  :label="perm"
                  @update:model-value="togglePermission(perm)"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- UI Feedback Section -->
        <UCard class="h-full">
          <template #header>
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-eye" /> UI Response
            </h2>
          </template>

          <div class="space-y-4">
            <!-- View Permission -->
            <div v-if="can('employee.view')" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 class="font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                <UIcon name="i-heroicons-user" /> Employee List Visible
              </h3>
              <p class="text-sm text-green-700 dark:text-green-400 mt-1">Granted via 'employee.view'</p>
            </div>
            <div v-else class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg opacity-50">
              <h3 class="font-medium text-gray-500">Employee List Hidden</h3>
            </div>

            <!-- Update Permission -->
            <UButton
              v-if="canAny(['employee.update', 'settings.manage'])"
              color="primary"
              variant="soft"
              block
              icon="i-heroicons-pencil-square"
            >
              Edit Records
            </UButton>

            <!-- Payroll Section -->
            <div v-if="canAll(['payroll.view', 'payroll.update'])" class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <h3 class="font-medium text-amber-800 dark:text-amber-300">Finance Control Center</h3>
              <p class="text-sm text-amber-700 dark:text-amber-400 mt-1">Requires both view and update permissions.</p>
            </div>

            <!-- Admin Only -->
            <UAlert
              v-if="can('settings.manage')"
              title="System Settings"
              description="Full administrative access granted."
              color="error"
              variant="subtle"
              icon="i-heroicons-shield-check"
            />
          </div>
        </UCard>
      </div>

      <!-- Debug State -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Store State</h2>
            <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">DEBUG</code>
          </div>
        </template>
        <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
{
  "role": "{{ permissionStore.currentRole }}",
  "permissions": {{ JSON.stringify(permissionStore.permissions, null, 2) }}
}
        </pre>
      </UCard>
    </div>
  </UContainer>
</template>
