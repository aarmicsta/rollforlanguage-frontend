<template>
  <nav aria-label="Footer Navigation">
    <ul class="flex flex-wrap justify-center gap-x-3 text-center text-sm">
      <li v-for="(link, index) in links" :key="link.href" class="flex items-center">
        <a
          :href="link.href"
          class="hover:underline transition duration-200"
        >
          {{ link.label }}
        </a>
        <span v-if="index !== links.length - 1" class="mx-2 text-gray-400">||</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]
</script>
