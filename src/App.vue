<script setup>
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader.vue";
import Feed from "@/components/Feed.vue";
</script>

<template>
	<TheHeader/>

	<main class="py-8">
		<Feed />
	</main>

	<TheFooter/>
</template>

<style scoped lang="scss">

</style>
