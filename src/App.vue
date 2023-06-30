<template>
  <div class="app-wrapper">
    <div class="app">
      <!-- <NavBar v-if="!navigation" /> -->
      <router-view />
      <!-- <div :class="!show ? 'main-container' : ''">
        <SideNav v-if="!show" />
        <router-view />
      </div>
      <div class="background" v-if="!show" :class="!show ? 'main' : ''">
        <div
          class="absolute inset-0 bg-svg bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
        ></div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import firebase from "firebase/compat/app";
import { auth } from "@/firebase/init";
// import store from "@/store";

// import NavBar from "./components/NavBar.vue";
// import SideNav from "./components/SideNav.vue";

export default {
  name: "app",
  data() {
    return {
      // show: null,
    };
  },
  components: {
    // NavBar,
    // SideNav,
  },
  setup() {},
  created() {
    // this.checkRoute();
    auth.onAuthStateChanged((user) => {
      this.$store.commit("updateUser", user);
      if (user) {
        this.$store.dispatch("getCurrentUser");
        // console.log(this.$store.state.profileUserId);
        console.log(auth.currentUser.uid);
      }
    });
  },
  methods: {
    // checkRoute() {
    //   if (
    //     this.$route.name === "login" ||
    //     this.$route.name === "signup" ||
    //     this.$route.name === "forgotpassword" ||
    //     this.$route.name === "index"
    //   ) {
    //     this.show = true;
    //     return;
    //   }
    //   this.show = false;
    // },
  },
  watch: {
    // $route() {
    //   this.checkRoute();
    // },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  // max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  // position: inherit;

  .container {
    // max-width: 1000px;
    position: inherit;
    // padding: 60px 10px;
    // padding-left: 10%;
    width: 90%;
  }
}

.container {
  // max-width: 1440px;
  max-width: 1920px;
  padding: 40px;
  margin: 0 auto;

  position: absolute;
  left: 10%;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}

.bg-svg {
  background: url(./assets/grid.svg);
}

.form-wrap.auth {
  overflow: hidden;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-self: center;
  margin: 0 auto;
  width: 90%;
  @media (min-width: 900px) {
    width: 100%;
  }

  form {
    padding: 0 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    @media (min-width: 900px) {
      padding: 0 50px;
    }

    h2 {
      text-align: center;
      font-size: 32px;
      color: #303030;
      margin-bottom: 40px;
      @media (min-width: 900px) {
        font-size: 40px;
      }
    }

    .inputs {
      width: 100%;
      // max-width: 350px;

      .input {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;

        input,
        select,
        .listbtn {
          width: 100%;
          border: none;
          // background-color: #f2f7f6;
          padding: 4px 4px 4px 30px;
          height: 50px;

          &:focus {
            outline: none;
          }

          // span {
          //   font-size: initial;
          // }
        }

        .icon {
          width: 12px;
          position: absolute;
          left: 6px;
        }
      }
    }
  }
}
.background {
  display: none;
  flex: 2;
  background-size: auto;
  // background-size: cover;
  // background-image: url("https://img.freepik.com/premium-vector/hand-painted-background-violet-orange-colours_23-2148427578.jpg?w=2000");
  // background-image: url("https://q3-2021.newsletter.entaingroup.com/wp-content/uploads/2021/01/Entain_Lockscreen_1920x1200-scaled.jpg");
  // background-image: url(./assets/beams.jpg);
  background-image: url(./assets/entain-bg.jpg);
  background-position: right;
  width: 100%;
  height: 100%;
  filter: opacity(10%);
  @media (min-width: 900px) {
    display: initial;
  }
}
.background.main {
  top: 0;
  position: absolute;
  z-index: -1;
  display: block;
}

.error {
  text-align: center;
  font-size: 12px;
  color: red;
}
.icon {
  &:hover {
    color: purple;
  }
}
button.rounded-blk {
  background-color: #262626eb;
  color: #fff;
  text-transform: uppercase;
  padding: 10px 15px;
  border-radius: 50px;
  font-size: 14px;

  &:hover {
    background-color: #000;
  }
}
a {
  transition: 0.5s ease all;

  &:hover {
    border-color: #303030;
  }
}
a.auth-link {
  text-decoration: none;
  color: #000;
  cursor: pointer;
  margin: 16px 0 32px;
  border-bottom: 1px solid transparent;
}
</style>
