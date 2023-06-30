import { createRouter, createWebHistory } from "vue-router";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "@/firebase/init";

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/IndexView.vue"),
    meta: {
      // auth: false,
      title: "KPI",
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: {
      auth: true,
      title: "Dashboard",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: {
      // auth: false,
      title: "Login",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/SignupView.vue"),
    meta: {
      // auth: false,
      title: "Signup",
    },
  },
  {
    path: "/forgot-password",
    name: "forgotpassword",
    component: () => import("../views/ForgotPassword.vue"),
    meta: {
      // auth: false,
      title: "Forgot Password",
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
    meta: {
      auth: true,
      title: "Profile",
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/AdminView.vue"),
    meta: {
      auth: true,
      title: "Admin",
    },
  },
  {
    path: "/internal-review",
    name: "internalreview",
    component: () => import("../views/InternalReview.vue"),
    meta: {
      auth: true,
      title: "Internal Review",
    },
  },
  {
    path: "/task/:taskId",
    name: "taskreview",
    component: () => import("../views/TaskReview.vue"),
    meta: {
      auth: true,
      title: "Task Review",
    },
  },
  {
    path: "/approved",
    name: "approved",
    component: () => import("../views/ApprovedView.vue"),
    meta: {
      auth: true,
      title: "Approved",
    },
  },
  {
    path: "/view-task/:taskId",
    name: "viewtaskreview",
    component: () => import("../views/ViewTaskReview.vue"),
    meta: {
      auth: true,
      title: "View Task Review",
    },
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/UsersList.vue"),
    meta: {
      auth: true,
      title: "Users",
    },
  },
  {
    path: "/edit-user/:userId",
    name: "edituser",
    component: () => import("../views/EditUser.vue"),
    meta: {
      auth: true,
      title: "Edit User",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   let user = firebase.auth().currentUser;
//   if (user) {
//     let token = await user.getIdTokenResult();
//   }
// });

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((res) => res.meta.auth)) {
//     firebase.auth().onAuthStateChanged((user) => {
//       if (!user) {
//         next({
//           name: "index",
//         });
//       } else {
//         next();
//       }
//     });
//     next();
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  if (to.matched.some((res) => res.meta.auth)) {
    // console.log(to.matched.some((res) => res.meta.auth));
    // if (firebase.auth().currentUser && to.name !== "login") {
    //   console.log("login");
    // }
    if (firebase.auth().currentUser) {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
          // console.log(doc.data().role);
          // (doc.data().role === 3 || doc.data().role === 4) &&
          if (
            doc.data().role === 4 &&
            (to.name === "users" ||
              to.name === "edituser" ||
              to.name === "internalreview" ||
              to.name === "taskreview")
          ) {
            // alert("You must be an admin to see this page");
            next({
              path: "/dashboard",
            });
          } else if (
            doc.data().role === 3 &&
            (to.name === "users" || to.name === "edituser")
          ) {
            // alert("You must be an admin to see this page");
            next({
              path: "/dashboard",
            });
          }
          next();
        });
      // next();
      // if (to.path === "/" || to.name !== "login" || to.path === "/signup") {
      //   next({ path: "/dashboard" });
      // } else {
      //   next();
      // }
    } else {
      // alert("You must be logged in to see this page");
      next({
        path: "/login",
      });
    }
    document.title = to.meta.title;
  } else {
    // console.log(to.matched.some((res) => res.meta.auth));
    if (
      firebase.auth().currentUser &&
      (to.name === "index" ||
        to.name === "login" ||
        to.name === "signup" ||
        to.name === "forgotpassword")
    ) {
      next({ path: "/dashboard" });
    } else {
      next();
    }
    // if (to.path === "/" || to.path === "/login" || to.path === "/signup") {
    //   next({ path: "/dashboard" });
    // } else {
    //   next();
    // }
    document.title = to.meta.title;
    // next();
  }
});

// router.beforeEach(async (to, from, next) => {
//   const auth = to.matched.some((res) => res.meta.auth);
//   // let user = firebase.auth().currentUser;
//   firebase.auth().onAuthStateChanged((user) => {
//     // if (auth && user === null) {
//     //   console.log(true);
//     //   console.log(!auth, user === null);
//     //   next({ name: "index" });
//     // } else {
//     //   console.log(false);
//     //   console.log(!auth, user !== null);
//     //   next();
//     // }
//     if (auth && user === null) {
//       next({ name: "index" });
//       console.log(!auth, user === null);
//     } else {
//       console.log(!auth, user !== null);
//       next();
//     }
//   });
// });

// router.beforeEach(async (to, from, next) => {
//   let user = firebase.auth().currentUser;
//   if (to.matched.some((res) => res.meta.auth)) {
//     if (user) {
//       return next();
//     }
//     return next({ name: "index" });
//   }
// });

export default router;
