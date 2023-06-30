<template>
  <Menu as="div" class="relative inline-block">
    <div>
      <MenuButton class="focus:outline-none">
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
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </span> -->
        <IconLayout
          :svgclass="`w-5 h-5`"
          :svgd="`M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z`"
        />
      </MenuButton>
    </div>
    <MenuItems
      class="absolute left-0 z-10 mt-2 w-36 origin-top-left rounded-md bg-white border shadow-lg focus:outline-none"
    >
      <div class="py-1">
        <MenuItem v-slot="{ active }" class="hover:bg-gray-100">
          <a
            :href="href"
            target="_blank"
            :class="[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm',
            ]"
            >{{ atitle }}</a
          >
        </MenuItem>
        <MenuItem v-slot="{ active }" class="hover:bg-gray-100">
          <router-link
            :to="to"
            :class="[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm',
            ]"
            >{{ rltitle }}</router-link
          >
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { defineProps } from "vue";
import IconLayout from "./IconLayout.vue";

defineProps({
  // el: { type: String },
  href: { type: String },
  to: { type: Object },
  atitle: { type: String },
  rltitle: { type: String },
});
</script>
