<template>
  <div class="w-full">
    <Combobox>
      <div class="relative mt-1" :class="zindex">
        <div
          class="relative w-full cursor-default overflow-hidden text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
        >
          <input
            :value="props.value"
            @input="$emit('update:modelInput', $event.target.value)"
            class="w-full border-none bg-grey py-2 pl-3 pr-10 text-md leading-5 text-gray-500 focus:ring-0"
            :type="props.type"
            :placeholder="props.placeholder"
            :class="props.disabled === true ? 'bg-disabled' : props.classes"
            :disabled="props.disabled"
          />
          <slot name="icon" />
        </div>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { Combobox } from "@headlessui/vue";

const props = defineProps({
  type: { type: String },
  placeholder: { type: String },
  classes: { type: String },
  value: { type: String },
  disabled: { type: Boolean },
  zindex: { type: String },
});

// let text = ref(null);

// const emit = defineEmits(["text"]);
// const input = () => {
//   console.log(text);
//   emit("text", text);
// };
</script>
