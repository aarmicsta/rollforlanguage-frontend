<template>
    <section class="bg-gray-300/80 text-gray-900 rounded-xl p-6 shadow-md space-y-10 min-h-[320px] lg:min-h-[400px] overflow-hidden">
      <!-- SECTION: How It Works -->
      <div class="text-center space-y-4">
        <h2 class="text-xl font-semibold">How It Works</h2>
        <div class="bg-gradient-to-b from-gray-300/80 to-gray-900/80 p-4 rounded-lg shadow transition duration-500 space-y-1">
          <h3 class="text-lg font-bold text-gray-900">
            Step {{ currentStepIndex + 1 }}: {{ currentStep.title }}
          </h3>
          <p class="text-sm text-gray-100">{{ currentStep.description }}</p>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t-2 border-white/50 w-full my-4"></div>

      <!-- SECTION: Testimonials -->
      <div class="text-center space-y-4">
        <h2 class="text-xl font-semibold">What Adventurers Are Saying</h2>
        <div class="bg-gradient-to-b from-gray-300/80 to-gray-900/80 p-4 rounded-lg shadow transition duration-500 italic space-y-1">
          <p class="text-gray-100">“{{ currentTestimonial.text }}”</p>
          <p class="mt-2 text-sm text-gray-300">— {{ currentTestimonial.author }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  // Onboarding Steps
  const steps = [
    {
      title: 'Create Your Playable Character',
      description: 'Build your avatar with class, species, and backstory.',
    },
    {
      title: 'Join a Campaign',
      description: 'Enter a teacher-led quest built for immersive learning.',
    },
    {
      title: 'Learn Through Adventure',
      description: 'Complete challenges and grow in your target language.',
    },
  ];
  
  const currentStepIndex = ref(0);
  const currentStep = computed(() => steps[currentStepIndex.value]);
  
  // Testimonials
  const testimonials = [
    {
      text: 'This is the most fun I’ve ever had learning a language!',
      author: 'Lina, A2 Student',
    },
    {
      text: 'It felt like I was leveling up in both German and gaming.',
      author: 'Kai, High School Junior',
    },
    {
      text: 'I never thought grammar could be this exciting.',
      author: 'Tariq, Adult Learner',
    },
  ];
  
  const currentTestimonialIndex = ref(0);
  const currentTestimonial = computed(
    () => testimonials[currentTestimonialIndex.value]
  );
  
  // Auto rotation
  let interval = null;
  
  onMounted(() => {
    interval = setInterval(() => {
      currentStepIndex.value = (currentStepIndex.value + 1) % steps.length;
      currentTestimonialIndex.value =
        (currentTestimonialIndex.value + 1) % testimonials.length;
    }, 8000); // rotates every 8 seconds
  });
  
  onUnmounted(() => {
    clearInterval(interval);
  });
  </script>
  