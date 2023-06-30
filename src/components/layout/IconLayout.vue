<template>
  <span class="icon" :class="classes">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      :class="svgclass"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="svgd" />
    </svg>
  </span>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  svgclass: { type: String },
  svgd: { type: String },
  classes: { type: String },
});
</script>
