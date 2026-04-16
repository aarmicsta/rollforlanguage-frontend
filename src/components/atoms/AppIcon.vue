<template>
    <component
      v-if="resolvedIcon"
      :is="resolvedIcon"
      v-bind="props.library === 'iconify' ? iconProps : {}"
      class="w-5 h-5"
    />
  </template>
  
  
  
  
  <script setup lang="ts">

  import * as HeroIcons from '@heroicons/vue/24/outline'
  import { Icon as IconifyIcon } from '@iconify/vue'
  import * as LucideIcons from 'lucide-vue-next'
  import { computed } from 'vue'
  
  interface Props {
    name: string
    library?: 'lucide' | 'heroicons' | 'iconify'
  }
  
  const props = defineProps<Props>()
  
  const iconProps = computed(() => ({
    icon: props.name
  }))

  const resolvedIcon = computed(() => {
  if (props.library === 'heroicons') {
    return props.name in HeroIcons ? HeroIcons[props.name as keyof typeof HeroIcons] : null
  } else if (props.library === 'iconify') {
    return IconifyIcon
  } else {
    return props.name in LucideIcons ? LucideIcons[props.name as keyof typeof LucideIcons] : null
  }
})

  </script>
  
  <style scoped>
  /* Optional: Add hover, color, or transition styles here */
  </style>
  