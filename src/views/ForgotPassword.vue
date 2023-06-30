<template>
  <auth-layout :header="`Reset Password`">
    <template #toaster>
      <ToasterC
        v-if="toastActive"
        :toastMsg="toastMsg"
        v-on:close-toast="closeToast"
      />
    </template>
    <!-- <Toaster
      v-if="modalActive"
      :modalMessage="modalMessage"
      v-on:close-modal="closeModal"
    /> -->
    <template #inputs>
      <div class="input">
        <!-- <input v-model="email" type="email" placeholder="Email" /> -->
        <ComboBoxInput
          :value="email"
          v-model:modelInput="email"
          :type="`email`"
          :placeholder="`Email`"
          class="w-full"
        >
          <template #icon>
            <span class="icon top-[15px]">
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
                  d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
                />
              </svg>
            </span>
          </template>
        </ComboBoxInput>
      </div>
    </template>
    <template #button>
      <button @click.prevent="resetPassword" class="rounded-blk">Reset</button>
    </template>
    <template #others>
      <p class="login-signup py-5">
        Back to
        <router-link
          class="router-link font-medium auth-link"
          :to="{ name: 'login' }"
          >Login</router-link
        >
      </p>
    </template>
  </auth-layout>
</template>

<script setup>
// import firebase from "firebase/compat/app";
import { auth } from "@/firebase/init";

import { ref } from "vue";

import AuthLayout from "@/components/layout/AuthLayout.vue";

import ToasterC from "@/components/ToasterC.vue";
import ComboBoxInput from "@/components/form/ComboBoxInput.vue";
import { useRouter } from "vue-router";

const email = ref("");
const toastActive = ref(false);
const toastMsg = ref("");
const router = useRouter();

const resetPassword = () => {
  console.log(email.value);
  auth
    .sendPasswordResetEmail(email.value)
    .then(() => {
      toastMsg.value = "If your account exist, you will receive an email.";
      toastActive.value = true;
      router.push({ name: "login" });
    })
    .catch((err) => {
      toastMsg.value = err.message
        .replace("Firebase: ", "")
        .replace(/\(auth.*\)\.?/, "");
      toastActive.value = true;
    });
};

const closeToast = () => {
  toastActive.value = !toastActive.value;
  // email.value = "";
};

// export default {
//   name: "ForgotPassword",
//   data() {
//     return {
//       email: "",
//       toastActive: false,
//       toastMsg: "",
//       // loading: null,
//     };
//   },
//   components: {
//     ComboBoxInput,
//     ToasterC,
//     AuthLayout,
//     // LoadingC,
//   },
//   methods: {
//     resetPassword() {
//       console.log(auth.sendPasswordResetEmail(this.email));
//       this.loading = true;
//       auth
//         .sendPasswordResetEmail(this.email)
//         .then(() => {
//           this.toastMsg = "If your account exist, you will receive an email.";
//           // this.loading = false;
//           this.toastActive = true;
//         })
//         .catch((err) => {
//           this.toastMsg = err.message
//             .replace("Firebase: ", "")
//             .replace(/\(auth.*\)\.?/, "");
//           // this.loading = false;
//           this.toastActive = true;
//         });
//     },
//     closeToast() {
//       this.toastActive = !this.toastActive;
//       this.email = "";
//     },
//   },
//   setup() {},
// };
</script>

<style lang="scss" scoped>
// .reset-password {
//   .form-wrap {
//     .reset {
//       h2 {
//         margin-bottom: 8px;
//       }
//     }
//   }
// }
</style>
