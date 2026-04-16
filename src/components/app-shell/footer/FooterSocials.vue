<template>
  <div class="flex space-x-4">
    <a
      v-for="social in socials"
      :key="social.name"
      :href="social.url"
      class="hover:text-primary-500 transition duration-200"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="social.name"
    >
      <span class="w-6 h-6 inline-block bg-gray-400 rounded-full"></span>
    </a>
  </div>
</template>

<script setup>
const socials = [
  { name: 'GitHub', url: 'https://github.com/' },
  { name: 'Twitter', url: 'https://twitter.com/' }
];
</script>