import { createStore } from "vuex";
// import axios from "axios";
import http from "../../http";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "@/firebase/init";
import json from "../../data.json";

const store = createStore({
  state: {
    jsonGrp: json.groups,
    jsonRole: json.role,
    jsonBr: json.brands,
    jsonLoc: json.location,
    jsontaskworkflow: json.taskworkflow,
    jsondashwf: json.dashwf,
    jsonqadesmg: json.qadesmg,
    wrikeGroup: [],
    wrikeUser: { data: {} },
    wrikebrands: { data: {} },
    wrikeTask: { data: {} },
    wrikeFolder: { data: {} },
    wrikerootfolder: "IEADVMHZI7777777",
    wrikeInternalReview: "IEADVMHZJMBRONOY",
    wrikeCustomFields: "IEADVMHZJUABUJGM",
    user: null,
    profileEmail: null,
    profileName: null,
    profileId: null,
    profileUserId: null,
    profileGroupId: null,
    profileAvatar: null,
    profileRole: null,
    profileBrands: null,
    profileLocation: null,
    profileUserTitle: null,
    profileInitials: null,
    DBUsers: [],
    DBUsersloaded: null,
    DBUserID: null,
    DBUserUserId: null,
    DBUserEmail: null,
    DBUserName: null,
    DBUserGroupId: null,
    DBUserAvatar: null,
    DBUserRole: null,
    DBUserBrands: null,
    DBUserLocation: null,
    DBUserUserTitle: null,
    DBReviewedTasks: [],
    DBLoggedTask: [],
    DBAmendTask: [],
  },
  actions: {
    getWrikeGroupData({ commit }, id) {
      return http
        .get(`/groups/${id}`)
        .then((res) => {
          commit("setWrikeGroup", res.data.data);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getWrikeUserData({ commit }, id) {
      return http
        .get(`/contacts/${id}`)
        .then((res) => {
          commit("setWrikeUser", res.data.data);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getWrikeBrands({ commit }) {
      return http
        .get(`/customfields/IEADVMHZJUABUJGM`)
        .then((res) => {
          commit(
            "setWrikeBrands",
            res.data.data
              .map((s) => s.settings)
              .map((v) => v.values)
              .flat()
          );
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getWrikeTaskData({ commit }, id) {
      return http
        .get(`/tasks/${id}`)
        .then((res) => {
          commit("setWrikeTask", res.data.data);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getWrikeFolderData({ commit }, id) {
      return http
        .get(`/folders/${id}` || `/tasks/${id}`)
        .then((res) => {
          commit("setWrikeFolder", res.data.data);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    async getCurrentUser({ commit }) {
      const dataBase = await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      const dbResults = await dataBase.get();
      commit("setProfileInfo", dbResults);
      commit("setProfileInitials");
      // const token = await user.getIdTokenResult();
    },
    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.profileId);
      await dataBase.update({
        role: state.profileRole,
        brands: state.profileBrands,
        location: state.profileLocation,
      });
      commit("setProfileInitials");
    },
    async getDBUsers({ commit }) {
      const dataBase = await db.collection("users");
      // const dbResults = await dataBase.get();

      const data = (await dataBase.get()).docs.map((doc) => doc.data());
      const id = (await dataBase.get()).docs.map((doc) => doc.id);

      const arr = [];
      for (let i = 0; i < id.length; i++) {
        const obj = {
          id: id[i],
          data: data[i],
        };
        arr.push(obj);
      }
      console.log(arr);

      commit("setDBUsers", arr);
      // console.log(id);
    },
    async getDBUserClickedInfo({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.DBUserID);
      const dbResults = await dataBase.get();
      commit("setDBUserClickedInfo", dbResults);
    },
    async updateDBUser({ state }) {
      const dataBase = await db.collection("users").doc(state.DBUserID);
      await dataBase.update({
        location: state.DBUserLocation,
        role: state.DBUserRole,
        brands: state.DBUserBrands,
      });
    },
    async getDBReviewedTasks({ commit }) {
      const dataBase = await db.collection("reviewedtasks");

      const data = (await dataBase.get()).docs.map((doc) => doc.data());
      const id = (await dataBase.get()).docs.map((doc) => doc.id);

      const arr = [];
      for (let i = 0; i < id.length; i++) {
        const obj = {
          id: id[i],
          data: data[i],
        };
        arr.push(obj);
      }
      console.log(arr);

      commit("setDBReviewedTasks", arr);
    },
    async getDBLoggedTasks({ commit }) {
      const dataBase = await db.collection("loggedtasks");

      const data = (await dataBase.get()).docs.map((doc) => doc.data());
      const id = (await dataBase.get()).docs.map((doc) => doc.id);

      const arr = [];
      for (let i = 0; i < id.length; i++) {
        const obj = {
          id: id[i],
          data: data[i],
        };
        arr.push(obj);
      }
      console.log(arr);

      commit("setDBLoggedTask", arr);
    },
    async getDBAmendTasks({ commit }) {
      const dataBase = await db.collection("amendtasks");

      const data = (await dataBase.get()).docs.map((doc) => doc.data());
      const id = (await dataBase.get()).docs.map((doc) => doc.id);

      const arr = [];
      for (let i = 0; i < id.length; i++) {
        const obj = {
          id: id[i],
          data: data[i],
        };
        arr.push(obj);
      }

      commit("setDBAmendTask", arr);
    },
  },
  mutations: {
    setWrikeGroup: (state, data) => {
      state.wrikeGroup.data = data;
    },
    setWrikeUser: (state, data) => {
      state.wrikeUser.data = data;
    },
    setWrikeBrands: (state, data) => {
      state.wrikebrands.data = data;
    },
    setWrikeTask: (state, data) => {
      state.wrikeTask.data = data;
    },
    setWrikeFolder: (state, data) => {
      state.wrikeFolder.data = data;
    },
    updateUser: (state, payload) => {
      state.user = payload;
    },
    setProfileInfo: (state, doc) => {
      state.profileId = doc.id;
      state.profileUserId = doc.data().userId;
      state.profileEmail = doc.data().email;
      state.profileName = doc.data().name;
      state.profileGroupId = doc.data().groupId;
      state.profileRole = doc.data().role;
      state.profileBrands = doc.data().brands;
      state.profileLocation = doc.data().location;
      state.profileAvatar = doc.data().avatar;
      state.profileUserTitle = doc.data().userTitle;
    },
    setDBUsers: (state, doc) => {
      state.DBUsers = doc;
    },
    setProfileInitials: (state) => {
      state.profileInitials = state.profileName
        .match(/(^\S\S?|\b\S)?/g)
        .join("")
        .match(/(^\S|\S$)?/g)
        .join("")
        .toUpperCase();
    },
    setDBReviewedTasks: (state, doc) => {
      state.DBReviewedTasks = doc;
    },
    setDBLoggedTask: (state, doc) => {
      state.DBLoggedTask = doc;
    },
    setDBAmendTask: (state, doc) => {
      state.DBAmendTask = doc;
    },
    changeRole: (state, payload) => {
      state.profileRole = payload;
    },
    changeBrands: (state, payload) => {
      state.profileBrands = payload;
    },
    changeLocation: (state, payload) => {
      state.profileLocation = payload;
    },
    DBUserId: (state, payload) => {
      state.DBUserID = payload;
    },
    setDBUserClickedInfo: (state, doc) => {
      // state.profileId = doc.id;
      state.DBUserUserId = doc.data().userId;
      state.DBUserEmail = doc.data().email;
      state.DBUserName = doc.data().name;
      state.DBUserGroupId = doc.data().groupId;
      state.DBUserRole = doc.data().role;
      state.DBUserBrands = doc.data().brands;
      state.DBUserLocation = doc.data().location;
      state.DBUserAvatar = doc.data().avatar;
      state.DBUserUserTitle = doc.data().userTitle;
    },
    editUserLocation: (state, payload) => {
      state.DBUserLocation = payload;
    },
    editUserRole: (state, payload) => {
      state.DBUserRole = payload;
    },
    editUserBrands: (state, payload) => {
      state.DBUserBrands = payload;
    },
  },
});

export default store;
