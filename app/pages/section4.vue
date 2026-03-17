<template>
  <div v-for="emp in employees" :key="emp.id">
    {{ emp.full_name }}
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const search = ref('')
const employees = ref([])

watch(search, async () => {
  try {
    const res = await fetch(`/api/employees?search=${search.value}`)
    const data = await res.json() // ✅ fix: fetch doesn't have res.data
    
    employees.value = data // fix 2
  } catch (err) { // fix 3 add error handling
    console.error(err)
  }
})
</script>