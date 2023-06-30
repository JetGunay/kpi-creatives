<template>
  <div
    class="toast flex justify-center bg-[rgba(0, 0, 0, 0.41)] h-full w-full z-50 absolute left-0 top-0"
  >
    <transition appear name="slide-fade">
      <div
        class="bg-white border border-purple-300 absolute top-5 z-10 rounded-md shadow-xl max-w-sm w-full"
      >
        <div
          class="text-grey-700 p-4 flex items-start justify-between"
          role="alert"
        >
          <p class="font-medium">{{ toastMsg }}</p>
          <span v-if="btnarr != undefined && btnarr != '' && btnarr.length > 0">
            <a
              :href="btn.link"
              v-for="btn in btnarr"
              :key="btn"
              class="text-white text-sm font-medium px-5 py-1.5 rounded-md m-1"
              :class="btn.class"
            >
              {{ btn.title }}
            </a>
          </span>
          <span v-else>
            <button
              @click="closeToast"
              aria-label="Close panel"
              class="text-gray-500 float-right mt-0.5"
              style="outline: none"
            >
              <IconLayout
                :svgclass="`h-5 w-5`"
                :svgd="`M6 18L18 6M6 6l12 12`"
              />
            </button>
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import IconLayout from "./layout/IconLayout.vue";

defineProps({
  toastMsg: { type: String },
  btnarr: { type: Object },
});

const emit = defineEmits(["close-toast"]);

const closeToast = () => {
  emit("close-toast");
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-from {
  transform: translateY(-50px);
  // opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-to {
  transform: translateY(0px);
  opacity: 1;
}
// .slide-fade-leave-from {
//   /* default opacity: 1;*/
// }
.slide-fade-leave-active {
  transition: opacity 1s;
}
.slide-fade-leave-to {
  opacity: 0;
}
.toast {
  background-color: rgba(0, 0, 0, 0.41);
}
</style>
