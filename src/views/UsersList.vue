<template>
  <pagination-layout
    :classes="`flex justify-center`"
    :items="users"
    :perpage="15"
    v-slot="props"
  >
    <div class="inline-flex flex-wrap justify-center">
      <div
        v-for="u in props.data"
        :key="u.id"
        class="max-w-xs bg-white border border-gray-200 rounded-lg shadow-md px-10 m-3"
      >
        <div class="flex flex-col items-center py-8">
          <!-- <img
            class="w-16 h-16 mb-3 rounded-full shadow-lg"
            :src="u.data.avatar"
            :alt="initials(u.data.name)"
          /> -->
          <div class="initials">
            <div
              :style="{
                'background-image': 'url(' + u.data.avatar + ')',
              }"
              class="img w-16 h-16 bg-cover rounded-full shadow-lg absolute"
            ></div>
            {{ initials(u.data.name) }}
          </div>
          <h6 class="mb-1 text-l font-medium text-gray-900">
            {{ u.data.name }}
          </h6>
          <span class="text-xs text-gray-500">{{ u.data.email }}</span>
          <span class="text-sm text-gray-500"
            >{{ role(u.data.role) }} | {{ group(u.data.groupId) }}</span
          >
          <div class="flex mt-4 space-x-3 md:mt-6">
            <!-- <span class="icon cursor-pointer" @click="editUser(u.data.userId)"
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </span> -->
            <IconLayout
              @click="editUser(u.data.userId)"
              :classes="`cursor-pointer`"
              :svgclass="`w-5 h-5`"
              :svgd="`M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10`"
            />
            <!-- &nbsp;|&nbsp; -->
            <!-- <span class="icon cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="maroon"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </span> -->
            <IconLayout
              :classes="`cursor-pointer text-red-900`"
              :svgclass="`w-5 h-5`"
              :svgd="`M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0`"
            />
          </div>
        </div>
      </div>
    </div>
  </pagination-layout>
</template>

<script setup>
import store from "@/store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import get from "@/functions/get";

import PaginationLayout from "@/components/layout/PaginationLayout.vue";
import IconLayout from "@/components/layout/IconLayout.vue";
const router = useRouter();
// const perpage = ref(15);
// const page = ref(1);

onMounted(async () => {
  await store.dispatch("getDBUsers");
});
const users = get.usersdb;

const group = (id) => {
  return store.state.jsonGrp
    .filter((r) => r.id === id)
    .map((t) => t.title)
    .toString();
};

const role = (id) => {
  return store.state.jsonRole
    .filter((r) => r.id === id)
    .map((t) => t.title)
    .toString();
};

const editUser = (id) => {
  store.state.DBUserBrands = null;
  router.push({ name: "edituser", params: { userId: id } });
};

const initials = (val) => {
  return val
    .match(/(^\S\S?|\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase();
};
</script>

<style lang="scss" scoped>
.initials {
  position: initial;
  width: 62px;
  height: 62px;
  font-size: 28px;
  font-weight: 600;
  background-color: #303030;
  color: #fff;
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
