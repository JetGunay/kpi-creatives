<template>
  <div class="w-full">
    <!-- <Listbox>
      <ListboxLabel class="block text-base font-medium text-gray-700">{{
        placeholder
      }}</ListboxLabel>
    </Listbox> -->
    <div class="p-2">
      <RadioGroup v-model="selected" @update:modelValue="check">
        <RadioGroupOption
          as="template"
          v-for="o in props.options"
          :key="o.title"
          :value="o"
          v-slot="{ active, checked }"
        >
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
        </RadioGroupOption>
      </RadioGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";

// const defchoices = [
//   { id: 0, title: "Yes" },
//   { id: 1, title: "No" },
//   { id: 2, title: "N/A" },
// ];

const props = defineProps({
  id: { type: Number },
  options: { type: Object },
  placeholder: { type: String },
});

// const selected = ref(defchoices[0]);
const selected = ref(props.options[props.id]);

const emit = defineEmits(["checked"]);

const check = () => {
  console.log(selected.value.title);
  emit("checked", selected.value.id);
};
</script>
