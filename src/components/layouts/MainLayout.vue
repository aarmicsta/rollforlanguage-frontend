<template>
  <div class="min-h-screen flex flex-col">
    <NavbarPlaceholder />

    <main class="flex-1 layout-offset-top">
      <slot />
    </main>

    <FooterPlaceholder />
  </div>
</template>

<script setup>
import FooterPlaceholder from '@/components/organisms/footer/Footer.vue';
import NavbarPlaceholder from '@/components/organisms/navbar/Navbar.vue';
</script>
