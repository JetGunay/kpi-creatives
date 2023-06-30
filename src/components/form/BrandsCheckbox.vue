<template>
  <div>
    <Listbox>
      <ListboxLabel class="block text-base font-medium text-gray-700">{{
        placeholder
      }}</ListboxLabel>
    </Listbox>
    <div class="grid grid-2 mt-2 m-4">
      <div
        v-for="(br, brIdx) in brands"
        :key="brIdx"
        class="inline-flex items-center"
      >
        <input
          type="checkbox"
          :value="br.title"
          name=""
          id=""
          :checked="props.options.includes(br.title) ? true : false"
          @change="checkbox"
          class="h-4 w-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500 mr-2"
        />
        <label for="" class="text-gray-600 font-medium text-md rg-lbl">{{
          br.title
        }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, reactive, defineEmits, watch, computed } from "vue";
import store from "@/store";

import { Listbox, ListboxLabel } from "@headlessui/vue";

const brands = ref(store.state.jsonBr);

const props = defineProps({
  options: { type: Object },
  placeholder: { type: String },
});

const br = reactive({
  title: [],
});

const propBr = computed(() => props.options);
console.log("brands");
console.log(propBr.value);
console.log(props.options);

const brandlist = ref(props.options);
// const brlist = computed(() => brandlist);
// const brandlist = [...(propBr.value || []), ...(br.title || [])];
// const arr = [];

// const brandlist = arr.concat(br.title, props.options);
console.log(br.title);
// console.log(brlist);

const emit = defineEmits(["checked"]);
const checkbox = (e) => {
  if (brandlist.value.includes(e.target.value)) {
    const index = brandlist.value.indexOf(e.target.value);
    brandlist.value.splice(index, 1);
  } else {
    brandlist.value.push(e.target.value);
  }
  console.log(brandlist);
  emit("checked", brandlist);
};
watch(
  () => brandlist,
  () => {
    console.log(brandlist);
  }
);
</script>

<style lang="scss" scoped>
.grid.grid-2 {
  display: grid;
  grid-template: auto / auto auto;
  @media (max-width: 600px) {
    grid-template: auto / auto;
  }
}
</style>
