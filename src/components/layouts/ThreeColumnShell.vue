<template>
  <!--
    =========================================================
    ThreeColumnShell
    =========================================================
    Responsibilities:
    - Provide a reusable three-column layout structure.
    - Support left sidebar, main content, and right sidebar regions.
    - Allow flexible content injection via named slots.

    Notes:
    - Layout is responsive via CSS grid.
    - Column visibility and sizing are controlled via Tailwind classes.
    - Intended for dashboard-style views with auxiliary side panels.
  -->
  <div class="grid grid-cols-12 gap-4">

    <!--
      Left Sidebar Region
      - Typically used for navigation, filters, or contextual tools.
      - Hidden on smaller screens.
    -->
    <aside class="hidden lg:block lg:col-span-3">
      <slot name="left" />
    </aside>

    <!--
      Main Content Region
      - Primary focus area for page content.
      - Expands to full width on smaller screens.
    -->
    <main class="col-span-12 lg:col-span-6">
      <slot />
    </main>

    <!--
      Right Sidebar Region
      - Typically used for secondary information, metrics, or actions.
      - Hidden on smaller screens.
    -->
    <aside class="hidden lg:block lg:col-span-3">
      <slot name="right" />
    </aside>

  </div>
</template>

<script setup>
/*
  =========================================================
  ThreeColumnShell
  =========================================================
  This component is layout-only and does not manage state or logic.

  Responsibilities:
  - Define structural layout.
  - Delegate all content rendering to slots.

  Notes:
  - No props or emits are required.
  - Designed for composability across multiple dashboard views.
*/
</script>