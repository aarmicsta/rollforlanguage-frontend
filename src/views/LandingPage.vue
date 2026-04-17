<template>
  <div class="min-h-screen flex flex-col bg-cover bg-center" style="background-image: url('backgrounds/bg-landing.webp');">
    <MainLayout>
      <ThreeColumnShell>
        <!-- LEFT COLUMN -->
        <template #left>
          <LandingValueShowcase />
        </template>

        <!-- CENTER COLUMN -->
        <template #center>
          <LandingHeroSection />
        </template>

        <!-- RIGHT COLUMN -->
        <template #right>
          <LandingExperienceCarousel />
          <PlayablePreviewCarousel />
        </template>
      </ThreeColumnShell>
    </MainLayout>
  </div>
</template>

<script setup>
import MainLayout from '@/components/layouts/MainLayout.vue';
import ThreeColumnShell from '@/components/layouts/ThreeColumnShell.vue';
import LandingExperienceCarousel from '@/features/public/landing/components/LandingExperienceCarousel.vue';
import LandingHeroSection from '@/features/public/landing/components/LandingHeroSection.vue';
import LandingValueShowcase from '@/features/public/landing/components/LandingValueShowcase.vue';
import PlayablePreviewCarousel from '@/features/public/landing/components/PlayablePreviewCarousel.vue';
</script>
