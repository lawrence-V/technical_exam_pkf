<script setup lang="ts">

import { useEmployeeStore } from '~/stores/employee'

const employeeStore = useEmployeeStore()

const search = ref('')
const page = ref(1)

// Fetch initially
onMounted(() => {
  employeeStore.getEmployees(search.value, page.value)
})

// Refetch whenever search or page changes
watch([search, page], () => {
  employeeStore.getEmployees(search.value, page.value)
})


const handleRetry = () => {
  employeeStore.getEmployees(search.value, page.value)
}

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'position', header: 'Position' },
  { accessorKey: 'department', header: 'Department' }
]
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold leading-tight text-gray-900 dark:text-white">
            Employees
          </h2>
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search employees..."
            class="w-64"
          />
        </div>
      </template>

      <!-- Error State -->
      <UAlert
        v-if="employeeStore.error"
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="subtle"
        :title="employeeStore.error"
        class="mb-4"
      >
        <template #description>
          There was a problem loading the employee data. Please try again.
          <div class="mt-3">
            <UButton color="error" variant="soft" @click="handleRetry">
              Retry
            </UButton>
          </div>
        </template>
      </UAlert>

      <!-- Data Table -->
      <UTable
        v-else
        :data="employeeStore.data"
        :columns="columns"
        :loading="employeeStore.loading"
      />

      <!-- Pagination -->
      <template #footer v-if="!employeeStore.error && employeeStore.pagination">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing <span class="font-medium">{{ (employeeStore.pagination.current_page - 1) * employeeStore.pagination.per_page + 1 }}</span> to <span class="font-medium">{{ Math.min(employeeStore.pagination.current_page * employeeStore.pagination.per_page, employeeStore.pagination.total) }}</span> of <span class="font-medium">{{ employeeStore.pagination.total }}</span> results
          </span>
          
          <UPagination
            v-model:page="page"
            :items-per-page="employeeStore.pagination.per_page"
            :total="employeeStore.pagination.total"
          />
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
