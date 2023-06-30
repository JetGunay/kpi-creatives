<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        :class="
          this.$route.name === 'profile'
            ? 'outline-none ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-100'
            : ''
        "
        class="inline-flex w-10 justify-center rounded-full border border-gray-300 bg-white px-1 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:outline-none hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 hover:ring-offset-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100 ease-in-out duration-300"
      >
        <!-- <img
          class="rounded-full"
          :src="this.$store.state.profileAvatar"
          :alt="this.$store.state.profileInitials"
        /> -->
        <div class="initials">
          <div
            :style="{
              'background-image':
                'url(' + this.$store.state.profileAvatar + ')',
            }"
            class="img w-8 h-8 bg-cover rounded-full shadow-lg absolute"
          ></div>
          {{ this.$store.state.profileInitials }}
        </div>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <!-- absolute w-max right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none -->
      <MenuItems
        class="absolute w-max left-[4rem] top-[-1rem] z-10 mt-2 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <div class="info">
            <!-- <p class="initials">{{ this.$store.state.profileInitials }}</p> -->
            <!-- <img
              class="avatar rounded-full"
              :src="this.$store.state.profileAvatar"
              alt=""
            /> -->
            <div class="right">
              <p>{{ this.$store.state.profileName }}</p>
              <p>{{ this.$store.state.profileUserTitle }}</p>
              <p>{{ this.$store.state.profileEmail }}</p>
              <p>{{ rolename }}</p>
            </div>
          </div>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <router-link
              class="option"
              :class="[
                active ? 'bg-gray-100 text-purple-700' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              :to="{ name: 'profile' }"
            >
              <IconLayout
                :svgclass="`w-5 h-5`"
                :svgd="`M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z`"
              />
              <p>Profile</p>
            </router-link>
          </MenuItem>
          <!-- <MenuItem v-slot="{ active }">
            <router-link
              class="option"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              :to="{ name: 'admin' }"
            >
              <span class="icon">
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
                    d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                  />
                </svg>
              </span>
              <p>
                {{
                  this.$store.state.jsonRole
                    .filter((r) => r.id === this.$store.state.profileRole)
                    .map((t) => t.title)
                    .toString()
                }}
              </p>
            </router-link>
          </MenuItem> -->
        </div>
        <div class="py-1">
          <MenuItem>
            <div
              @click="signOut"
              class="option cursor-pointer hover:bg-gray-100 hover:text-purple-700 text-gray-700 block px-4 py-2 text-sm"
            >
              <IconLayout
                :svgclass="`w-5 h-5`"
                :svgd="`M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75`"
              />
              <p>Sign Out</p>
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import router from "@/router";
import store from "@/store";

import IconLayout from "./layout/IconLayout.vue";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed } from "vue";
// import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const signOut = () => {
  firebase.auth().signOut();
  store.state.profileId = null;
  store.state.profileUserId = null;
  router.push({ name: "index" });
  window.location.reload();
};

const rolename = computed({
  get() {
    return store.state.jsonRole
      .filter((r) => r.id === store.state.profileRole)
      .map((t) => t.title)
      .toString();
  },
});
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #fff;

  .avatar {
    width: 40px;
  }

  .right {
    flex: 1;
    margin-left: 10px;

    p:nth-child(1) {
      font-size: 14px;
    }

    p:nth-child(2),
    p:nth-child(3),
    p:nth-child(4) {
      font-size: 12px;
    }
  }
}
.initials {
  position: relative;
  width: 30px;
  height: 30px;
  background-color: #303030;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
}
.option {
  text-decoration: none;
  // color: #fff;
  display: flex;
  align-items: center;
  // margin-bottom: 12px;

  .icon {
    width: 18px;
    height: auto;
  }
  p {
    font-size: 14px;
    margin-left: 12px;
  }

  &:last-child {
    margin-bottom: 0px;
  }

  &.router-link-active,
  &.router-link-exact-active {
    color: purple;
  }
}
.option:last-child {
  margin-bottom: 0px;
}
</style>
