<template>
  <div class="w-full">
    <Listbox>
      <ListboxLabel class="block text-base font-medium text-gray-700">{{
        placeholder
      }}</ListboxLabel>
    </Listbox>
    <div class="p-2">
      <RadioGroup v-model="selected" @update:modelValue="check">
        <RadioGroupOption
          as="div"
          v-for="o in props.options"
          :key="o.title"
          :value="o"
          v-slot="{ active, checked }"
          class="inline-block py-1"
        >
          <!-- <div> -->
          <div
            :class="[
              active
                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400'
                : '',
              checked ? 'bg-purple-900 text-white' : 'bg-white',
            ]"
            class="relative inline-flex items-center mx-2 cursor-pointer rounded-lg px-5 py-3 shadow-md focus:outline-none"
          >
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center">
                <div class="text-sm">
                  <RadioGroupLabel
                    as="p"
                    :class="checked ? 'text-white' : 'text-gray-900'"
                    class="font-medium rg-lbl"
                  >
                    <!-- <span v-if="o.link"
                      ><a :href="o.link" target="_blank">{{ o.title }}</a></span
                    >
                    <span v-else>{{ o.title }}</span> -->
                    {{ o.title }}
                  </RadioGroupLabel>
                </div>
              </div>
              <div v-show="checked" class="shrink-0 text-white ml-1">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="#fff"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <span class="relative inline-block" v-if="o.link"
            ><a :href="o.link" target="_blank"
              ><span class="absolute top-[-10px] pl-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg> </span></a
          ></span>
          <!-- </div> -->
        </RadioGroupOption>
      </RadioGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
// import { useRoute } from "vue-router";

import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  Listbox,
  ListboxLabel,
} from "@headlessui/vue";

const props = defineProps({
  id: { type: Number },
  options: { type: Object },
  disabled: { type: Boolean },
  placeholder: { type: String },
});

const emit = defineEmits(["checked", "checkedtitle"]);

const selected = ref(props.options[props.id]);

// const selected = ref(
//   computed({
//     get: () => props.options[props.id],
//     set: (newval) => {
//       emit("checked", newval);
//       emit("checkedtitle", newval.title);
//       console.log(newval.title);
//     },
//   })
// );

// let selected = ref(props.options[props.id]);
// if (useRoute().name === "profile") {
//   console.log("profile " + true);
//   console.log(useRoute().name);
//   selected = ref(
//     computed({
//       get: () => props.options[props.id],
//       set: (newval) => {
//         emit("selected", newval.id);
//         emit("selectedtitle", newval.title);
//       },
//     })
//   );
// }

// console.log("/");
// console.log(props.options[props.id]);
// console.log(selected);
// console.log("/");

const check = () => {
  // console.log(selected.value.percentage)
  emit("checked", selected.value);
};
</script>

<style></style>
<!-- http://localhost:8081/task/IEADVMHZKQ7TQSOX -->
<!-- http://localhost:8081/task/IEADVMHZKQ7QKHFV -->
