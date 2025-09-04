<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 overflow-hidden">
    <div class="relative w-full max-w-md h-[80vh]">
      <transition-group name="swipe" tag="div" class="relative w-full h-full">
        <div
          v-for="(post, i) in visiblePosts"
          :key="post.id"
          class="absolute inset-0 bg-white rounded-xl shadow-lg overflow-hidden"
          :style="cardStyle(i)"
          @touchstart="startDrag($event, i)"
          @touchmove="onDrag($event, i)"
          @touchend="endDrag(i)"
        >
          <!-- User -->
          <div class="flex items-center px-4 py-3 border-b">
            <img :src="post.user.logo_url" class="w-10 h-10 rounded-full object-cover mr-3" />
            <div>
              <p class="font-semibold">{{ post.user.fullname }}</p>
              <p class="text-xs text-gray-500">@{{ post.user.username }}</p>
            </div>
          </div>

          <!-- Image -->
          <div class="relative w-full h-80 bg-black flex items-center justify-center">
            <img
              :src="post.uploads?.[0]"
              class="max-h-full max-w-full object-contain"
              alt="post"
            />
          </div>

          <!-- Content -->
          <div class="px-4 py-3">
            <p class="font-medium mb-1">{{ post.title }}</p>
            <p class="text-gray-700 whitespace-pre-line text-sm">{{ post.content }}</p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-6 mt-6">
      <button
        @click="forceSwipe('left')"
        class="w-16 h-16 rounded-full bg-red-500 text-white text-2xl flex items-center justify-center shadow hover:bg-red-600"
      >
        ❌
      </button>
      <button
        @click="forceSwipe('right')"
        class="w-16 h-16 rounded-full bg-green-500 text-white text-2xl flex items-center justify-center shadow hover:bg-green-600"
      >
        ❤️
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFeedStore } from '@/stores/feed'

const feed = useFeedStore()
const index = ref(0)

const dragX = ref(0)
const startX = ref(0)
const active = ref(false)
const direction = ref(null)

const visiblePosts = computed(() => feed.items.slice(index.value, index.value + 2))

function startDrag(e, i) {
  if (i !== 0) return
  startX.value = e.touches[0].clientX
  active.value = true
}

function onDrag(e, i) {
  if (!active.value || i !== 0) return
  dragX.value = e.touches[0].clientX - startX.value
}

function endDrag(i) {
  if (i !== 0) return
  active.value = false

  if (Math.abs(dragX.value) > 100) {
    // Decide swipe direction
    direction.value = dragX.value > 0 ? 'right' : 'left'
    // Animate off-screen
    dragX.value = dragX.value > 0 ? 1000 : -1000
    setTimeout(() => nextPost(), 300)
  } else {
    // Reset
    dragX.value = 0
  }
}

function cardStyle(i) {
  if (i === 0) {
    return {
      transform: `translateX(${dragX.value}px) rotate(${dragX.value / 15}deg)`,
      transition: active.value ? 'none' : 'transform 0.3s ease-out',
      zIndex: 2
    }
  }
  if (i === 1) {
    return { transform: 'scale(0.95)', zIndex: 1 }
  }
  return { display: 'none' }
}

function nextPost() {
  dragX.value = 0
  direction.value = null
  if (index.value < feed.items.length - 1) {
    index.value++
  } else {
    feed.fetchFeed()
  }
}

// Buttons force swipe
function forceSwipe(dir) {
  dragX.value = dir === 'right' ? 1000 : -1000
  setTimeout(() => nextPost(), 300)
}
</script>

<style scoped>
.swipe-move {
  transition: transform 0.3s ease-out;
}
</style>
