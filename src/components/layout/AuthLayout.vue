<template>
  <slot name="toaster" />
  <div class="form-wrap auth">
    <form>
      <h2>{{ header }}</h2>
      <div class="inputs w-full max-w-[350px]">
        <slot name="inputs" />
      </div>
      <slot name="button" />
      <p class="relative py-10">
        <span class="hr-line">
          <span
            class="bg-white relative z-10 px-5 text-sm font-medium text-gray-500"
            >OR</span
          >
        </span>
      </p>
      <slot name="others" />
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  header: { type: String },
});
</script>

<style lang="scss" scoped>
.hr-line::after {
  content: " ";
  display: block;
  height: 2px;
  width: 310px;
  position: absolute;
  top: 50%;
  left: -125px;
  background: #f3f3f3;
}
.angle {
  display: none;
  position: absolute;
  background-color: #fff;
  z-index: 1;
  transform: rotateZ(4deg);
  width: 75px;
  right: -40px;
  height: 101%;
  @media (min-width: 900px) {
    display: initial;
  }
}
</style>
