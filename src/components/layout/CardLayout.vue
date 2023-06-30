<template>
  <div
    class="card-header flex justify-between mx-2 mb-5 pb-5 border-b border-b-2 border-gray-100"
    :class="cheaderclass"
  >
    <!-- header left -->
    <div class="flex my-2" :class="cheaderleftclass">
      <slot name="cheaderleft" />
    </div>
    <!-- header right -->
    <div class="flex self-center" :class="cheaderrightclass">
      <slot name="cheaderright" />
    </div>
  </div>
  <div class="card-content" :class="ccontentclass">
    <slot name="ccontent" />
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  cheaderclass: { type: String },
  cheaderleftclass: { type: String },
  cheaderrightclass: { type: String },
  ccontentclass: { type: String },
});
</script>

<style lang="scss" scoped></style>
