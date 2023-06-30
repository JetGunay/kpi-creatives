<template>
  <form-layout>
    <ToasterC
      v-if="toastActive"
      :toastMsg="toastMsg"
      v-on:close-toast="closeToast"
    />
    <template v-for="u in user" :key="u.id">
      <card-layout>
        <template #cheaderleft>
          <div class="profile-info">
            <div class="initials">
              <div
                :style="{
                  'background-image': 'url(' + u.data.avatar + ')',
                }"
                class="img w-14 h-14 bg-cover rounded-full shadow-lg absolute"
              ></div>
              {{ initials(u.data.name) }}
            </div>
          </div>
          <div class="flex-col ml-3 font-medium">
            <p class="text-sm text-gray-900">{{ u.data.name }}</p>
            <p class="text-xs text-gray-500">
              {{ role(u.data.role) }} | {{ group(u.data.groupId) }}
            </p>
            <p class="text-xs text-gray-500">{{ u.data.email }}</p>
          </div>
        </template>
        <template #cheaderright>
          <button class="rounded-blk" @click.prevent="editUser">
            Save Changes
          </button>
        </template>
        <template #ccontent>
          <div
            class="input z-20 relative mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
          >
            <ListWithId
              :id="u.data.role"
              :options="this.$store.state.jsonRole"
              :placeholder="`Role`"
              :classes="`w-full`"
              @selected="selectedRole"
            />
          </div>
          <div
            class="input z-10 relative mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
          >
            <RadioGroup
              :id="u.data.location"
              :options="this.$store.state.jsonLoc"
              :placeholder="`Location`"
              @checked="selectedLocation"
            />
          </div>
          <div class="relative">
            <BrandsCheckbox
              :options="u.data.brands"
              :placeholder="`Brands`"
              @checked="checkedBrands"
            />
          </div>
        </template>
      </card-layout>
    </template>
  </form-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import store from "@/store";
import db from "@/firebase/init";

import FormLayout from "@/components/layout/FormLayout.vue";
import CardLayout from "@/components/layout/CardLayout.vue";

import ToasterC from "@/components/ToasterC.vue";

import BrandsCheckbox from "@/components/form/BrandsCheckbox.vue";
import ListWithId from "@/components/form/ListWithId.vue";
import RadioGroup from "@/components/form/RadioGroup.vue";

const route = useRoute();
const userid = route.params.userId;
const toastMsg = ref("Changes were saved.");
const toastActive = ref(null);
const user = ref([]);
const uid = ref(null);
const selectedroleid = ref();
const selectedlocationid = ref();
const selectedbrands = ref([]);

onMounted(async () => {
  await store.dispatch("getDBUsers");
  uid.value = store.state.DBUsers.filter((i) => i.data.userId == userid)
    .map((i) => i.id)
    .toString();
  user.value = store.state.DBUsers.filter((i) => i.data.userId == userid);
});

const editUser = () => {
  // console.log(user.value);
  let roleid = 0;
  selectedroleid.value != undefined
    ? (roleid = selectedroleid.value)
    : (roleid = user.value.map((r) => r.data.role)[0]);

  let locationid = 0;
  selectedlocationid.value != undefined
    ? (locationid = selectedlocationid.value)
    : (locationid = user.value.map((r) => r.data.location)[0]);

  let brandsarr = [];
  selectedbrands.value.length != 0
    ? (brandsarr = selectedbrands.value)
    : (brandsarr = user.value.map((r) => r.data.brands)[0]);

  const getdata = db.collection("users").doc(uid.value);
  getdata.update({
    location: locationid,
    role: roleid,
    brands: brandsarr,
  });
  toastActive.value = !toastActive.value;
};

const initials = (val) => {
  return val
    .match(/(^\S\S?|\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase();
};

const role = (id) => {
  return store.state.jsonRole
    .filter((r) => r.id == id)
    .map((t) => t.title)
    .toString();
};

const group = (id) => {
  return store.state.jsonGrp
    .filter((r) => r.id == id)
    .map((t) => t.title)
    .toString();
};

const closeToast = () => {
  toastActive.value = !toastActive.value;
};

const selectedRole = (payload) => {
  console.log(payload);
  selectedroleid.value = payload;
  // store.commit("editUserRole", payload);
};

const selectedLocation = (payload) => {
  console.log(payload.id);
  selectedlocationid.value = payload.id;
  // store.commit("editUserLocation", payload);
};

const checkedBrands = (payload) => {
  console.log(payload.value);
  selectedbrands.value = payload.value;
  // store.commit("editUserBrands", payload.value);
};
</script>

<style lang="scss" scoped>
.initials {
  position: initial;
  width: 54px;
  height: 54px;
  font-size: 25px;
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
