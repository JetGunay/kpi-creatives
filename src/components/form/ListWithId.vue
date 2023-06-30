<template>
  <div :class="classes" class="z-10">
    <Listbox v-model="selected" @update:modelValue="checked">
      <div class="relative">
        <ListboxLabel class="block text-base font-medium text-gray-700">{{
          placeholder
        }}</ListboxLabel>
        <ListboxButton
          class="listbtn relative w-full cursor-default bg-grey border-none py-2 pl-3 text-left shadow-md leading-5 text-gray-500 focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
        >
          <span class="block truncate text-base">{{ selected.title }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-grey py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="r in options"
              :key="r.id"
              :value="r"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-purple-600 text-white' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ r.title }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-purple-600': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
// import store from "@/store";
// import { useRoute } from "vue-router";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

// const role = store.state.jsonRole;
const props = defineProps({
  id: { type: Number },
  options: { type: Object },
  placeholder: { type: String },
  classes: { type: String },
});

onMounted(() => {
  console.log(props.id);
});

const emit = defineEmits(["selected", "selectedtitle"]);
const selected = ref(props.options[props.id]);
console.log(props.options);
console.log(props.id);
// const id = computed(() => props.id);
// console.log("id " + id.value);
// const selected = ref(
//   computed({
//     get: () => props.options[id.value],
//     set: (newval) => {
//       emit("selected", newval.id);
//       emit("selectedtitle", newval.title);
//     },
//   })
// );

watch(
  () => props.id,
  () => {
    console.log("watch id " + props.id);
  }
);

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

// console.log(selected.value.title);
const checked = () => {
  // console.log(selected.value.id);
  emit("selected", selected.value.id);
  emit("selectedtitle", selected.value.title);
};
</script>
