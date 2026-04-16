<template>
    <section class="py-2 px-6 max-w-7xl mx-auto text-center space-y-16">
      <!-- WHY CHOOSE US SECTION -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[560px] md:max-w-none">
        <WhyChooseUsCard
          icon="🧠"
          title="Story-Driven Learning"
          description="Experience immersive quests where language is part of the adventure."
        />
        <WhyChooseUsCard
          icon="🎯"
          title="Teacher-Guided Progress"
          description="Join campaigns led by your instructor and track your growth."
        />
        <WhyChooseUsCard
          icon="⚔️"
          title="Gamified Mastery"
          description="Earn XP, level up, and collect achievements through real learning."
        />
        <WhyChooseUsCard
          icon="🌍"
          title="Built for Multilingual Expansion"
          description="Supports German now—expanding to new languages soon!"
        />
      </div>
  
      <!-- DIVIDER -->
      <div class="border-t-2 border-white/50 w-full my-4"></div>
  
      <!-- FEATURE HIGHLIGHTS SECTION -->
      <div class="flex flex-col space-y-6">
        <FeatureHighlight
          icon="🧾"
          title="Quest Logs"
          description="Track objectives, progress, and rewards."
        />
        <FeatureHighlight
          icon="🎙️"
          title="Voice Practice"
          description="Use real speech tools to practice aloud."
        />
        <FeatureHighlight
          icon="📚"
          title="Vocabulary Crafting"
          description="Unlock, collect, and use words in context."
        />
        <FeatureHighlight
          icon="📊"
          title="Performance Stats"
          description="View your language growth over time."
        />
      </div>
    </section>
  </template>
  
  <script setup>
  import FeatureHighlight from '@/features/public/landing/components/FeatureHighlight.vue';
  import WhyChooseUsCard from '@/features/public/landing/components/WhyChooseUsCard.vue';
  </script>
  