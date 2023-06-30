<template>
  <div>
    <div
      class="relative text-center flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12"
    >
      <div
        class="relative px-6 pt-10 pb-8 sm:mx-auto sm:max-w-lg sm:px-10 z-10"
      >
        <div class="mx-auto max-w-md">
          <img src="../assets/e-logo.png" class="logo" alt="Entain" />
          <div class="divide-y divide-gray-300/50">
            <div class="pt-8 text-base font-semibold leading-7">
              <router-link
                class="bg-white shadow-md rounded-md px-4 py-2 hover:text-white hover:bg-purple-900 transition duration-150 ease-in-out"
                :to="{ name: 'login' }"
                >LOG IN</router-link
              >
              <span class="text-purple-500 px-5">|</span>
              <router-link
                class="bg-white shadow-md rounded-md px-4 py-2 hover:text-white hover:bg-purple-900 transition duration-150 ease-in-out"
                :to="{ name: 'signup' }"
                >SIGN UP</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="background absolute top-0">
      <div
        class="absolute inset-0 bg-svg bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
      ></div>
    </div>
  </div>
</template>

<script setup>
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";

// const user = computed(() => {
//   return firebase.auth().currentUser;
// });
</script>
