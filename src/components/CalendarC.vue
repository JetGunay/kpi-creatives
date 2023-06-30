<template>
  <v-date-picker
    class="inline-block h-full z-30"
    v-model="date"
    color="purple"
    :masks="masks"
    :attributes="attrs"
    @update:modelValue="check"
  >
    <!-- @update:modelValue="check" -->
    <template v-slot="{ inputValue, togglePopover }">
      <div class="flex items-center">
        <button
          class="p-2 bg-grey border shadow-lg border text-gray-800 rounded-md hover:text-purple-900 hover:border-purple-900 focus:text-purple-900 focus:border-purple-900 focus:outline-none"
          @click="togglePopover()"
        >
          <!-- <span class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </span> -->
          <IconLayout
            :svgclass="`w-5 h-5`"
            :svgd="`M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z`"
          />
        </button>
        <input
          :value="inputValue"
          class="hidden bg-grey text-gray-700 w-[125px] py-1.5 px-3 appearance-none shadow-lg rounded-r focus:outline-none"
          readonly
        />
      </div>
    </template>
  </v-date-picker>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import IconLayout from "./layout/IconLayout.vue";

const date = ref();
const masks = ref({
  input: "MMM DD 'YY'",
});
const attrs = ref([
  {
    key: "today",
    dot: true,
    dates: new Date(),
  },
]);

const props = defineProps({
  qdate: { type: String },
});

if (props.qdate == "" || props.qdate == undefined) {
  date.value = new Date();
}
date.value = new Date(props.qdate);

const emit = defineEmits(["check"]);

const check = (value) => {
  emit("check", value);
};
</script>
<style lang="scss" scoped>
.vc-popover-content-wrapper {
  z-index: 30;
}
</style>
