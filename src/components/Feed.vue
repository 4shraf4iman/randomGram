<template>
  <div class="relative">
    <!-- Filter Tabs -->
    <div class="flex justify-center border-b bg-white sticky top-0 z-10">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        @click="changeSort(option.value)"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="sortMode === option.value
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700'"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Grid Mode -->
    <div v-if="viewMode === 'grid'">
      <!-- Mobile: stacked posts -->
      <div v-if="isMobile" class="space-y-4 p-4">
        <PostCard
          v-for="post in sortedFeed"
          :key="post.id"
          :post="post"
          @select="openPost"
        />
      </div>

      <!-- Desktop: grid with modal -->
      <div v-else class="grid grid-cols-4 gap-4 p-6">
        <div
          v-for="post in sortedFeed"
          :key="post.id"
          class="relative w-full h-72 bg-zinc-100 rounded-md overflow-hidden cursor-pointer group"
          @click="openPost(post)"
        >
          <img
            :src="post.uploads?.[0]"
            alt="post"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <!-- Loader -->
      <div ref="loader" class="flex justify-center py-6">
        <div v-if="isLoading"><Loader/></div>
      </div>

      <!-- Modal (desktop only) -->
      <PostModal
        v-if="!isMobile && selectedPost"
        :post="selectedPost"
        @close="closePost"
      />
    </div>

    <!-- Swipe Mode -->
    <SwipeView v-else />

    <!-- Floating Action Button -->
    <FabSwitch :mode="viewMode" @toggle="toggleView" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useFeedStore } from '@/stores/feed'
import FabSwitch from '@/components/ComponentsPreview/FabSwitch.vue'
import SwipeView from '@/components/ComponentsPreview/SwipeView.vue'
import PostCard from '@/components/ComponentsPreview/PostCard.vue'
import Loader from '@/components/ComponentsPreview/Loader.vue'
import PostModal from '@/components/ComponentsPreview/PostModal.vue'

const feed = useFeedStore()
const selectedPost = ref(null)
const viewMode = ref('grid') // grid | swipe
const sortMode = ref('newest')
const isLoading = ref(false)
const page = ref(1)
const loader = ref(null)

const filterOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Most Liked', value: 'likes' },
  { label: 'Random', value: 'random' },
]

const isMobile = computed(() => window.innerWidth < 768)

// Sorting logic
const sortedFeed = computed(() => {
  const posts = [...feed.items]
  switch (sortMode.value) {
    case 'oldest':
      return posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    case 'likes':
      return posts.sort((a, b) => b.likes_count - a.likes_count)
    case 'random':
      return posts.sort(() => Math.random() - 0.5)
    case 'newest':
    default:
      return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
})

function setupInfiniteScroll() {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
      await loadMore()
    }
  })
  if (loader.value) {
    observer.observe(loader.value)
  }
}

async function loadMore() {
  isLoading.value = true
  page.value++
  await feed.fetchFeed({ page: page.value })
  isLoading.value = false
}

function changeSort(value) {
  sortMode.value = value
}

function openPost(post) {
  selectedPost.value = post
}
function closePost() {
  selectedPost.value = null
}
function toggleView() {
  viewMode.value = viewMode.value === 'grid' ? 'swipe' : 'grid'
}

onMounted(async () => {
  await feed.fetchFeed({ page: page.value })
  setupInfiniteScroll()
})
</script>
