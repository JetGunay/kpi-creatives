import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import "v-calendar/dist/style.css";
import store from "./store";
// import firebase from "firebase/compat/app";
import { auth } from "@/firebase/init";
// import "firebase/compat/auth";

import VCalendar from "v-calendar";

// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";

// firebase.initializeApp(firebaseConfig);

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    createApp(App).use(store).use(router).use(VCalendar).mount("#app");
  }
});
