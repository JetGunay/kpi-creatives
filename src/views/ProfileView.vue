<template>
  <form-layout>
    <ToasterC
      v-if="toastActive"
      :toastMsg="toastMsg"
      v-on:close-toast="closeToast"
    />
    <card-layout>
      <template #cheaderleft>
        <div class="profile-info">
          <!-- <img
                          class="w-14 h-14 mb-3 rounded-full shadow-lg"
                          :src="this.$store.state.profileAvatar"
                          :alt="this.$store.state.profileInitials"
                          @error="imgError"
                          v-if="!imgError"
                        />
                        <div class="initials" v-if="imgError">
                          {{ this.$store.state.profileInitials }}
                        </div> -->
          <div class="initials">
            <div
              :style="{
                'background-image':
                  'url(' + this.$store.state.profileAvatar + ')',
              }"
              class="img w-14 h-14 bg-cover rounded-full shadow-lg absolute"
            ></div>
            {{ this.$store.state.profileInitials }}
          </div>
        </div>
        <div class="flex-col ml-3">
          <p class="text-sm text-gray-900">{{ name }}</p>
          <p class="text-xs text-gray-500">{{ rolename }} | {{ group }}</p>
          <p class="text-xs text-gray-500">{{ email }}</p>
        </div>
      </template>
      <template #cheaderright>
        <button class="rounded-blk" @click.prevent="updateProfile">
          Save Changes
        </button>
      </template>
      <template #ccontent>
        <div
          v-if="isAuthorized"
          class="input z-20 relative mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
        >
          <ListWithId
            :id="role"
            :options="this.$store.state.jsonRole"
            :placeholder="`Role`"
            :classes="`w-full`"
            @selected="selectedRoleId"
          />
        </div>
        <div
          class="input z-10 relative mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
        >
          <RadioGroup
            :id="location"
            :options="this.$store.state.jsonLoc"
            :placeholder="`Location`"
            @checked="selectedLocation"
          />
        </div>
        <div class="relative" v-if="isAuthorized">
          <BrandsCheckbox
            :options="brands"
            :placeholder="`Brands`"
            @checked="checkedBrands"
          />
        </div>
      </template>
    </card-layout>
  </form-layout>
</template>

<script setup>
import { computed, ref } from "vue";

import store from "@/store";

import FormLayout from "@/components/layout/FormLayout.vue";
import CardLayout from "@/components/layout/CardLayout.vue";

import ToasterC from "@/components/ToasterC.vue";

import ListWithId from "../components/form/ListWithId.vue";
import RadioGroup from "@/components/form/RadioGroup.vue";
import BrandsCheckbox from "../components/form/BrandsCheckbox.vue";

// const grpname = ref("");
const toastMsg = ref("Changes were saved.");
const toastActive = ref(null);

const closeToast = () => {
  toastActive.value = !toastActive.value;
};

const name = computed(() => {
  return store.state.profileName;
});
const group = computed(() => {
  return store.state.jsonGrp
    .filter((r) => r.id == store.state.profileGroupId)
    .map((t) => t.title)
    .toString();
});
const role = computed(() => {
  return store.state.profileRole;
});
const rolename = computed(() => {
  return store.state.jsonRole
    .filter((r) => r.id == role.value)
    .map((t) => t.title)
    .toString();
});
const location = computed(() => {
  return store.state.profileLocation;
});
// const locationName = computed(() => {
//   return store.state.jsonLoc
//     .filter((r) => r.id == location.value)
//     .map((t) => t.title)
//     .toString();
// });
const brands = computed(() => {
  return store.state.profileBrands;
});
const email = computed(() => {
  return store.state.profileEmail;
});
const isAuthorized = computed(() => {
  return role.value == 0 || role.value == 1 || role.value == 2;
});

const selectedRoleId = (payload) => {
  store.commit("changeRole", payload);
};
const selectedLocation = (payload) => {
  store.commit("changeLocation", payload.id);
};
const checkedBrands = (payload) => {
  store.commit("changeBrands", payload);
};
const updateProfile = () => {
  store.dispatch("updateUserSettings");
  toastActive.value = !toastActive.value;
};

// const imgError = () => {
//   return true;
// }
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
// .form-wrap.auth {
//   height: auto;

//   form {
//     justify-content: flex-start;
//     align-items: flex-start;

//     .inputs {
//       max-width: initial;

//       .input {
//         margin: 16px 0;

//         input {
//           width: 100%;
//         }
//       }
//     }
//   }
// }
// .profile {
//   .container {
//     // max-width: 1000px;
//     // padding: 60px 25px;

//     h2 {
//       text-align: center;
//       margin-bottom: 16px;
//       font-weight: 300;
//       font-size: 32px;
//     }

//     .profile-info {
//       // border-radius: 8px;
//       // box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
//       //   0 2px 4px -1px rgba(0, 0, 0, 0.06);
//       // padding: 32px;
//       // background-color: #f1f1f1;
//       // display: flex;
//       // flex-direction: column;
//       // max-width: 600px;
//       // margin: 32px auto;

//       .initials {
//         position: initial;
//         width: 54px;
//         height: 54px;
//         font-size: 25px;
//         font-weight: 600;
//         background-color: #303030;
//         color: #fff;
//         display: flex;
//         align-self: center;
//         align-items: center;
//         justify-content: center;
//         border-radius: 50%;
//       }

//       .admin-badge {
//         display: flex;
//         align-self: center;
//         color: #fff;
//         font-size: 14px;
//         padding: 8px 24px;
//         border-radius: 8px;
//         background-color: #303030;
//         margin: 16px 0;
//         text-align: center;
//         text-transform: capitalize;

//         .icon {
//           width: 14px;
//           height: auto;
//           margin-right: 8px;
//         }
//       }
//       button {
//         align-self: center;
//       }
//     }
//   }
// }

// .card-header::after {
//   content: "";
//   background-color: #f3f3f3;
//   width: 100%;
//   height: 2px;
//   display: block;
//   margin: 20px 0;
// }
</style>
