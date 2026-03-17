<script setup lang="ts">
import { ref, watch } from 'vue'

interface Employee {
  id: number | string
  name: string
  email?: string
  department: string
  [key: string]: any
}

interface Pagination {
  current_page: number
  total: number
  per_page: number
}

const props = defineProps<{
  employees: Employee[]
  loading: boolean
  pagination?: Pagination
}>()

const emits = defineEmits<{
  (e: 'changePage', page: number): void
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')
let debounceTimeout: any = null

watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emits('search', newQuery)
  }, 400)
})

const columns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'department',
    header: 'Department'
  }
]

// Mock email helper since it might be missing in the data
const getEmail = (employee: Employee) => {
  if (employee.email) return employee.email
  return `${employee.name.toLowerCase().replace(/\s+/g, '.')}@example.com`
}

const handlePageChange = (page: number) => {
  emits('changePage', page)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <div class="flex justify-between items-center">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search employees..."
        color="neutral"
        variant="outline"
        class="w-full max-w-sm"
      />
    </div>

    <!-- Table -->
    <UCard>
      <UTable
        :data="employees"
        :columns="columns"
        :loading="loading"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No employees found.' }"
      >
   
        <template #email-cell="{ row }">
          <span class="text-gray-500 dark:text-gray-400">
            {{ getEmail(row.original) }}
          </span>
        </template>

        <!-- Loading State Skeletons -->
        <template #loading>
          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <div v-for="i in 10" :key="i" class="flex items-center px-4 py-3 gap-4">
              <USkeleton class="h-4 flex-1" />
              <USkeleton class="h-4 flex-1" />
              <USkeleton class="h-4 flex-1" />
            </div>
          </div>
        </template>
      </UTable>

      <!-- Pagination Footer -->
      <template v-if="pagination && pagination.total > 0" #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total {{ pagination.total }} employees
          </div>
          <UPagination
            :page="pagination.current_page"
            :total="pagination.total"
            :items-per-page="pagination.per_page"
            @update:page="handlePageChange"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
