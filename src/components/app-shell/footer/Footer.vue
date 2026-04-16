<script setup>
import FooterBranding from './FooterBranding.vue'
import FooterCredits from './FooterCredits.vue'
import FooterLinks from './FooterLinks.vue'
import FooterSocials from './FooterSocials.vue'
</script>

<template>
  <footer class="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 py-2 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="flex flex-col items-center md:items-start space-y-1">
        <FooterBranding />
      </div>
      <div class="flex flex-col items-center space-y-1">
        <FooterLinks />
      </div>
      <div class="flex flex-col items-center md:items-end space-y-1">
        <FooterSocials />
      </div>
    </div>

    <div class="border-t border-gray-300 dark:border-gray-700 my-4"></div>

    <div class="max-w-7xl mx-auto px-4 pb-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
      <div class="mb-2 md:mb-0">
        &copy; {{ new Date().getFullYear() }} Roll for Language. All rights reserved.
      </div>
      <FooterCredits />
    </div>
  </footer>
</template>
