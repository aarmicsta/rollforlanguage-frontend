<template>
    <section class="flex flex-col items-center text-center space-y-8">
      <!-- Headline -->
      <div class="bg-white/80 text-gray-900 text-4xl md:text-6xl font-extrabold px-6 py-4 rounded-xl shadow-md leading-tight max-w-2xl mx-auto">
        Master a Language, Forge Your Adventure!
      </div>
  
      <!-- Subheadline -->
      <div class="bg-slate-800/70 text-gray-100 text-lg md:text-xl px-6 py-4 rounded-xl shadow-md max-w-2xl mx-auto">
        Join a story-driven RPG where every quest helps you learn German.
      </div>
  
      <!-- CTA Button Row -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <!-- Register Button -->
        <RouterLink to="/register">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-xl transition shadow-md">
            Start Your Journey
          </button>
        </RouterLink>
  
        <!-- Login Button -->
        <RouterLink to="/login">
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-900 text-lg font-semibold px-6 py-3 rounded-xl transition shadow-md">
            Already Enlisted?
          </button>
        </RouterLink>
      </div>
    </section>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  </script>
  