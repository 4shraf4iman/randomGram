import { defineStore } from 'pinia'
import axios from 'axios'

export const useFeedStore = defineStore('feed', {
  state: () => ({
    items: [],
    offset: 0,
    limit: 10,
    loading: false,
    hasMore: true,
  }),
  actions: {
    async fetchFeed() {
      console.log('fetchFeed() called ⚡')
      if (this.loading || !this.hasMore) return

      this.loading = true
      try {
        const res = await axios.get('https://api.popules.com/api/feed', {
          params: { offset: this.offset, limit: this.limit },
        })

        console.log('API raw response:', res.data)

        const newItems = res.data.data ?? []
        console.log('Extracted items:', newItems)

        if (newItems.length) {
          this.items.push(...newItems)
          this.offset += this.limit
        } else {
          this.hasMore = false
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
