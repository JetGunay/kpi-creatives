<template>
  <div>
    <span v-for="u in arr" :key="u.id">
      <div class="relative inline-block group">
        <div class="flex flex-col items-center">
          <img :src="u.avatarUrl" alt="" class="w-12 h-12 rounded-full" />
        </div>
        <div
          class="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-32 right-[-2.5rem] top-[-2rem]"
        >
          <span
            class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded md shadow-lg"
            >{{ u.firstName }} {{ u.lastName }}</span
          >
          <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
        </div>
      </div>
    </span>
  </div>
  <div class="mx-3 flex flex-col self-center">
    <div
      class="text-sm font-medium whitespace-nowrap overflow-hidden text-elipsis max-w-[12rem] md:max-w-[10rem] sm:max-w-[9rem]"
    >
      {{ title }}
    </div>
    <div class="text-xs font-medium flex justify-between items-center py-1">
      <span class="mr-1">{{ brand }}</span>
      <span class="mr-1 text-lime-500" v-if="grade != undefined"
        >{{ grade }}%</span
      >
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  arr: { type: Object },
  title: { type: String },
  brand: { type: String },
  grade: { type: Number },
});
</script>
