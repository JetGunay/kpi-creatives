<template>
  <div class="main-container z-[1]">
    <SideNav />
    <div class="container" :class="classes">
      <slot />
    </div>
  </div>
  <div class="background fixed">
    <!-- <div
      class="absolute inset-0 bg-svg bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
    ></div> -->
  </div>
</template>

<script setup>
import SideNav from "../SideNav.vue";
import { defineProps } from "vue";

defineProps({
  classes: { type: String },
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
