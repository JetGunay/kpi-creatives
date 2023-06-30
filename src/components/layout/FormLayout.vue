<template>
  <main-layout :classes="classes">
    <div
      class="lg:w-7/12 md:w-9/12 sm:w-12/12 flex justify-center my-0 mx-auto bg-white border border-gray-200 rounded-lg shadow-md py-8"
    >
      <div class="form-wrap h-auto w-full px-14"><slot /></div>
    </div>
  </main-layout>
</template>

<script setup>
import MainLayout from "./MainLayout.vue";
</script>

<style lang="scss" scoped>
// .form-wrap {
//   height: auto;
// }
</style>
