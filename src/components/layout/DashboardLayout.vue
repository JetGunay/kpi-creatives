<template>
  <!-- left side -->
  <div class="col-span-2 self-start">
    <!-- header -->
    <div class="flex justify-between items-center">
      <slot name="contentheader" />
    </div>
    <!-- tasks tiles -->
    <div class="w-full my-0 mx-auto">
      <div class="p-4" v-if="tasktotal">{{ nofoundtask }}</div>
      <div class="content w-full py-2 overflow-y-auto max-h-[40rem] h-max">
        <template v-for="t in tasks" :key="t.id">
          <a
            v-for="task in tasksortedbybrand
              .flat()
              .filter((i) => i.id == t.parentIds || i.id == t.superParentIds)"
            :key="task.id"
            :href="t.permalink"
            class="flex my-3 mx-3 border border-gray-100 text-sm text-gray-600 items-center bg-white rounded-lg drop-shadow-md py-5 pl-8 pr-6 hover:bg-gray-100 hover:border-gray-200"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex w-max relative">
                <div class="flex w-[3rem] justify-center">
                  <template v-for="tr in t.responsibleIds" :key="tr">
                    <span
                      v-for="u in members.filter((i) => i.id === tr)"
                      :key="u.id"
                      class="flex items-center spch"
                    >
                      <div class="relative inline-block group">
                        <div class="flex flex-col items-center">
                          <img
                            class="w-8 h-8 rounded-full shadow-md"
                            :src="u.avatarUrl"
                            alt=""
                          />
                        </div>
                        <div
                          class="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-max left-[2.5rem] top-[0rem]"
                        >
                          <span
                            class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded-md shadow-md"
                            >{{ u.firstName }} {{ u.lastName }}</span
                          >
                          <!-- <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div> -->
                        </div>
                      </div>
                    </span>
                  </template>
                </div>
                <div class="flex flex-col w-[28rem] md:w-[28rem]">
                  <div
                    class="px-2 text-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {{ t.title }}
                  </div>
                  <div class="w-[10rem] md:w-[10rem] px-2 text-xs">
                    {{
                      task.customFields
                        .filter((i) => i.id === store.state.wrikeCustomFields)
                        .map((v) => v.value)[0]
                    }}
                  </div>
                </div>
              </div>
              <div class="px-4 w-[8rem] md:w-[8rem] text-end">
                {{ displaydate(t.dates.start) }}
              </div>
            </div>
          </a>
        </template>
      </div>
    </div>
  </div>
  <!-- right side -->
  <div class="grid grid-rows-4 grid-flow-col gap-6 px-5">
    <div
      class="flex justify-center drop-shadow-md rounded-md relative bg-white px-10 pt-9 pb-4 before:text-gray-400 before:content-['Date'] before:absolute before:text-sm before:top-2"
    >
      <span
        class="w-full before:content-[''] before:block before:border-b before:mb-3"
        ><span class="flex justify-center">{{ date }}</span></span
      >
    </div>
    <template v-for="r in rl" :key="r">
      <div
        v-if="r.access"
        class="flex justify-center drop-shadow-md rounded-md relative bg-white px-10 pt-9 pb-4 before:text-gray-400 wfbf before:absolute before:text-sm before:top-2"
        :style="`--content-p: '${r.aftercontent}'`"
      >
        <span
          class="w-full before:content-[''] before:block before:border-b before:mb-3"
        >
          <router-link
            :to="r.to"
            class="flex justify-center"
            :class="r.rlclass ? '' : 'pointer-events-none'"
          >
            <IconLayout :svgclass="r.svgclass" :svgd="r.svgd" />
            <span class="px-3">{{ r.total }}</span>
          </router-link>
        </span>
      </div>
    </template>
  </div>
  <!-- right -->
  <div></div>
</template>

<script setup>
import { defineProps } from "vue";
import moment from "moment";
import store from "@/store";

import IconLayout from "./IconLayout.vue";

defineProps({
  tasks: { type: Object },
  tasksortedbybrand: { type: Object },
  members: { type: Object },
  date: { type: String },
  rl: { type: Object },
  nofoundtask: { type: String },
  tasktotal: { type: Boolean, default: false },
});

const displaydate = (val) => {
  return moment(val).format("MMM Do 'YY");
};
</script>

<style lang="scss" scoped>
span.spch:nth-child(n) {
  margin-left: -20px;
}
// span.spch:first-child {
//   margin-left: 0px;
// }
.wfbf::before {
  content: var(--content-p);
}
</style>
