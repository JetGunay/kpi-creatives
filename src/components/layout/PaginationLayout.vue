<template>
  <main-layout :classes="classes"><slot :data="displayeditems" /></main-layout>
  <!-- pagination -->
  <div
    class="pagination lg:w-8/12 md:w-10/12 sm:w-12/12 mx-auto my-0 relative left-0 right-0"
  >
    <ul class="flex justify-between border-t-2">
      <li class="page-item relative top-[-2px]">
        <button
          type="button"
          class="cursor-pointer hover:text-purple-600 page-link flex items-center text-sm font-bold px-5 py-3"
          :class="page != 1 ? '' : 'pointer-events-none'"
          @click="page--"
        >
          <span class="pr-1"
            ><svg
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
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          </span>
          Previous
        </button>
      </li>
      <!-- v-for="pageNumber in pages.slice(page - 1, page + 4)" -->
      <li class="page-item relative top-[-2px]">
        <button
          type="button"
          class="cursor-pointer hover:text-purple-600 hover:border-t-2 hover:border-purple-600 page-link px-3 text-sm font-bold px-5 py-3"
          v-for="pageNumber in pages"
          @click="page = pageNumber"
          :key="pageNumber"
          :class="
            pageNumber === page
              ? 'active border-t-2 border-purple-600 text-purple-600 pointer-events-none'
              : ''
          "
        >
          {{ pageNumber }}
        </button>
      </li>
      <li class="page-item relative top-[-2px]">
        <button
          type="button"
          @click="page++"
          class="cursor-pointer hover:text-purple-600 page-link flex items-center text-sm font-bold px-5 py-3"
          :class="page < pages.length ? '' : 'pointer-events-none'"
        >
          Next
          <span class="pl-1">
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
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import MainLayout from "./MainLayout.vue";
import { ref, computed, defineProps } from "vue";

const props = defineProps({
  classes: { type: String },
  items: { type: Object },
  perpage: { type: Number },
});

const page = ref(1);

const paginate = (users) => {
  let pg = page.value;
  let prpg = props.perpage;
  // eslint-disable-next-line prettier/prettier
      let from = (pg * prpg) - prpg;
  // eslint-disable-next-line prettier/prettier
      let to = (pg * prpg);
  return users.slice(from, to);
};

const displayeditems = computed(() => {
  return paginate(props.items);
});

const pages = computed(() => {
  let pages = [];
  let numofpages = Math.ceil(props.items.length / props.perpage);
  for (let i = 1; i <= numofpages; i++) {
    pages.push(i);
  }
  return pages;
});
</script>
