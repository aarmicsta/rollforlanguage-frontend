<template>
    <section class="bg-gradient-to-b from-gray-300/80 to-gray-900/80 text-gray-900 rounded-xl p-6 shadow-md ...">

      <!-- Section Title -->
      <h2 class="text-xl font-semibold">Meet the Characters</h2>
  
      <div class="w-full max-w-xs bg-white/10 rounded-lg p-4 text-center shadow-inner transition duration-500 h-[400px] flex flex-col justify-between">
        <img
          :src="currentItem.image"
          :alt="currentItem.name"
          class="mx-auto rounded-lg w-full h-40 object-cover object-center"
        />

        <div class="flex-1 mt-4">
          <h3 class="text-lg font-bold mb-1">{{ currentItem.name }}</h3>
          <p class="text-sm text-gray-300 overflow-hidden">{{ currentItem.description }}</p>
        </div>

        <div class="mt-4 flex space-x-4 justify-center">
          <button @click="previous" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm transition">
            ◀ Previous
          </button>
          <button @click="next" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm transition">
            Next ▶
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const characters = [
    {
      name: 'Sylrin the Scholar',
      description: 'A wise elf who deciphers forgotten languages to unlock ancient magic.',
      image: '/images/characters/sylrin.webp',
    },
    {
      name: 'Grux the Stoneborn',
      description: 'A powerful dwarven warrior who speaks with the earth and defends the mountain realms.',
      image: '/images/characters/grux.webp',
    },
    {
      name: 'Kaelis of the Veil',
      description: 'A mysterious shapeshifter whose language changes with each form.',
      image: '/images/characters/kaelis.webp',
    },
  ];
  
  const currentIndex = ref(0);
  
  const currentItem = computed(() => characters[currentIndex.value]);
  
  function next() {
    currentIndex.value = (currentIndex.value + 1) % characters.length;
  }
  
  function previous() {
    currentIndex.value =
      (currentIndex.value - 1 + characters.length) % characters.length;
  }
  
  // Optional autoplay
  let interval = null;
  
  onMounted(() => {
    interval = setInterval(() => {
      next();
    }, 8000); // 8-second rotation
  });
  
  onUnmounted(() => {
    clearInterval(interval);
  });
  </script>
  