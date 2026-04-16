<template>
  <!--
    =========================================================
    MainLayout
    =========================================================
    Responsibilities:
    - Provide the default page shell for standard frontend views.
    - Render the shared navbar and footer placeholders.
    - Expose a central slot for page-specific content.

    Notes:
    - This layout uses a simple vertical flex structure.
    - The main content area expands to fill remaining viewport height.
    - `layout-offset-top` is responsible for top spacing beneath the navbar.
  -->
  <div class="min-h-screen flex flex-col">
    <!-- Shared top navigation placeholder. -->
    <NavbarPlaceholder />

    <!--
      Primary content region.
      - Expands to fill available vertical space.
      - Renders whatever view or page content is passed into the layout.
    -->
    <main class="flex-1 layout-offset-top">
      <slot />
    </main>

    <!-- Shared footer placeholder. -->
    <FooterPlaceholder />
  </div>
</template>

<script setup>
/*
  =========================================================
  MainLayout Imports
  =========================================================
  Imports shared structural components used by the layout shell.
*/
import FooterPlaceholder from '@/components/organisms/footer/Footer.vue';
import NavbarPlaceholder from '@/components/organisms/navbar/Navbar.vue';
</script>