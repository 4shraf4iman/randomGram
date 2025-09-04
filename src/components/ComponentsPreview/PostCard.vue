<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
    @click="$emit('select', post)"
  >
    <!-- User -->
    <div class="flex items-center px-4 py-3 border-b">
      <img
        :src="post.user.logo_url"
        class="w-10 h-10 rounded-full object-cover mr-3"
        alt="user avatar"
      />
      <div>
        <p class="font-semibold">{{ post.user.fullname }}</p>
        <p class="text-xs text-gray-500">@{{ post.user.username }}</p>
      </div>
    </div>

    <!-- Image -->
    <div class="relative w-full h-72 bg-zinc-100 flex items-center justify-center">
      <img
        :src="post.uploads?.[0]"
        class="w-full h-full object-cover"
        alt="post image"
      />
    </div>

    <!-- Content -->
    <div class="px-4 py-3 space-y-2">
      <!-- Title -->
      <p class="font-medium text-base">{{ post.title }}</p>

      <!-- Body -->
      <p class="text-gray-700 whitespace-pre-line text-sm">
        {{ post.content }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between text-xs text-gray-500 pt-2">
        <div class="flex items-center space-x-4">
          <span v-if="post.likes_count !== undefined">❤️ {{ post.likes_count }}</span>
          <span v-if="post.comments_count !== undefined">💬 {{ post.comments_count }}</span>
        </div>
        <span v-if="post.created_at">
          {{ formatDate(post.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'

const props = defineProps({
  post: { type: Object, required: true }
})

defineEmits(['select'])

function formatDate(date) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return ''
  }
}
</script>
