<template>
  <main-layout>
    <LoadingC v-if="loading" />
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <div
          class="bg-grey shadow-md font-medium text-l px-4 py-2 rounded-md mx-1"
        >
          <slot name="headertitle"></slot>
        </div>
        <slot name="dlbtn" />
      </div>
      <div class="flex flex-col items-end">
        <div class="checkdate flex items-center py-2">
          <slot name="headerright"></slot>
        </div>
        <div class="flex pt-1" v-if="bruser">
          <slot name="headerbruser" v-if="bruser"></slot>
        </div>
      </div>
    </div>

    <div class="flex" :class="contentclass">
      <slot name="content" />
    </div>
  </main-layout>
</template>

<script setup>
import MainLayout from "./MainLayout.vue";
import LoadingC from "../LoadingC.vue";
import { defineProps } from "vue";

defineProps({
  loading: { type: Boolean },
  bruser: { type: Boolean, default: false },
  contentclass: { type: String },
});
</script>

<style lang="scss">
.main-container {
  // max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  // position: inherit;

  .container {
    // max-width: 1000px;
    position: inherit;
    // padding: 60px 10px;
    // padding-left: 10%;
    width: 90%;
  }
}
</style>
