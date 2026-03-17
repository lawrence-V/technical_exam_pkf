<script setup lang="ts">
import { useEmployeeStore } from '~/stores/employee'

const employeeStore = useEmployeeStore()

const search = ref('')
const page = ref(1)

// Fetch initially
onMounted(() => {
  employeeStore.getEmployees(search.value, page.value)
})

const handleSearch = (query: string) => {
  search.value = query
  page.value = 1 // Reset to first page on new search
  employeeStore.getEmployees(search.value, page.value)
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  employeeStore.getEmployees(search.value, page.value)
}

const handleRetry = () => {
  employeeStore.getEmployees(search.value, page.value)
}
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold leading-tight text-gray-900 dark:text-white">
            Employees
          </h2>
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

      <!-- Employee Table Component -->
      <EmployeeTable
        v-else
        :employees="employeeStore.data"
        :loading="employeeStore.loading"
        :pagination="employeeStore.pagination || undefined"
        @search="handleSearch"
        @change-page="handlePageChange"
      />
    </UCard>
  </UContainer>
</template>
