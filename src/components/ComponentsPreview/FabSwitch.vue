<template>
  <button
    @click="$emit('toggle')"
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition"
  >
    <span v-if="mode === 'grid'">🔀</span>
    <span v-else>📑</span>
  </button>
</template>

<script setup>
defineProps({
  mode: { type: String, default: 'grid' } // grid | swipe
})
</script>
