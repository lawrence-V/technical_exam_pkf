import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Employee {
  id: number
  name: string
  position: string
  department: string
}

export interface PaginationData {
  current_page: number
  per_page: number
  total: number
  total_pages: number
}

export interface EmployeeResponse {
  data: Employee[]
  pagination: PaginationData
}

// Generate 55 dummy employees for the store to consume
const dummyEmployees: Employee[] = Array.from({ length: 55 }, (_, i) => {
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales']
  const positions = ['Developer', 'Manager', 'Analyst', 'Specialist', 'Director']
  
  return {
    id: i + 1,
    name: `Employee ${i + 1}`,
    position: positions[i % positions.length] as string,
    department: departments[i % departments.length] as string
  }
})

// Dummy fetch simulating the API response
const fetchDummyEmployees = async (search: string, page: number): Promise<EmployeeResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random failure to trigger retry
      if (Math.random() < 0.2) {
        reject(new Error('Network Error or Server Unavailable'))
        return
      }

      const filtered = dummyEmployees.filter(emp => 
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
      )

      const perPage = 10
      const start = (page - 1) * perPage
      const paginated = filtered.slice(start, start + perPage)

      resolve({
        data: paginated,
        pagination: {
          current_page: page,
          per_page: perPage,
          total: filtered.length,
          total_pages: Math.ceil(filtered.length / perPage)
        }
      })
    }, 500)
  })
}


export const useEmployeeStore = defineStore('employee', () => {
  const data = ref<Employee[]>([])
  const pagination = ref<PaginationData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getEmployees = async (search: string = '', page: number = 1) => {
    loading.value = true
    error.value = null

    let attempt = 0
    let success = false
    const maxRetries = 3

    while (attempt < maxRetries && !success) {
      try {
        attempt++
        
        // Use our dummy function acting as the API
        const response = await fetchDummyEmployees(search, page)
        
        data.value = response.data
        pagination.value = response.pagination
        success = true
      } catch (err: any) {
        if (attempt >= maxRetries) {
          error.value = err.message || 'Failed to fetch employees after multiple attempts'
          data.value = []
          pagination.value = null
        } else {
          // Wait before retrying (1000ms delay)
          await new Promise(res => setTimeout(res, 1000))
        }
      }
    }

    loading.value = false
  }

  return {
    data,
    pagination,
    loading,
    error,
    getEmployees
  }
})
