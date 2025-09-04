<template>
  <div
    v-if="post"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-lg w-full max-w-xl md:max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center">
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
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-lg">✖</button>
      </div>

      <!-- Image -->
      <div class="relative w-full h-[400px] bg-zinc-100 flex items-center justify-center">
        <img
          :src="post.uploads?.[0]"
          class="max-h-full max-w-full object-contain"
          alt="post image"
        />
      </div>

      <!-- Content -->
      <div class="p-4 space-y-3">
        <p class="font-medium text-lg">{{ post.title }}</p>
        <p class="text-gray-700 whitespace-pre-line text-sm">{{ post.content }}</p>

        <!-- Meta -->
        <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
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
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'

defineProps({
  post: { type: Object, required: false }
})
defineEmits(['close'])

function formatDate(date) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return ''
  }
}
</script>
