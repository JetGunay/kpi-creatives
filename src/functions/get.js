import store from "@/store";
import moment from "moment";
import http from "../../http";

import { ref, computed } from "vue";

store.dispatch("getDBUsers");
store.dispatch("getDBReviewedTasks");

var get = {
  thisweek: computed(() => {
    return [
      {
        title: "This week",
        start: moment().startOf("week").format("YYYY-MM-DD"),
        end: moment().endOf("week").format("YYYY-MM-DD"),
      },
    ];
  }),
  month: computed(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const obj = {
        id: i,
        title:
          moment().format("MMMM") ==
          moment().subtract([i], "month").format("MMMM")
            ? "This month"
            : moment().subtract([i], "month").format("MMM 'YY"),
        start: moment()
          .startOf("month")
          .subtract([i], "month")
          .format("YYYY-MM-DD"),
        end: moment()
          .subtract([i], "months")
          .endOf("month")
          .format("YYYY-MM-DD"),
      };
      arr.push(obj);
    }
    return arr;
  }),
  usersdb: computed(() => {
    return store.state.profileRole == 2
      ? store.state.DBUsers.filter(
          (d) =>
            d.data.userId != store.state.profileUserId &&
            d.data.role > 2 &&
            d.data.groupId == store.state.profileGroupId
        )
      : store.state.DBUsers.filter(
          (d) => d.data.userId != store.state.profileUserId
        );
  }),
  async wrikeusers() {
    return await store
      .dispatch("getWrikeGroupData", store.state.profileGroupId)
      .then((r) => {
        const memberIds = r.data.data.map((m) => m.memberIds).flat();
        const arr = [];
        for (let i = 0; i < memberIds.length; i++) {
          arr.push(
            store
              .dispatch("getWrikeUserData", memberIds[i])
              .then((r) => new Promise((res) => res(r.data.data)))
          );
        }
        // store.dispatch("getDBUsers");
        return Promise.all(arr).then((r) => {
          const userarr = r.flat();
          console.log(this.userfilter(userarr));
          return this.userfilter(userarr);
          // let idfilter = userarr
          //   .filter((i) => i.id == store.state.profileUserId)
          //   .map((i) => i.id)
          //   .toString();
          // let teamlead = store.state.DBUsers.filter(
          //   (i) =>
          //     i.data.groupId === store.state.profileGroupId && i.data.role <= 2
          // ).map((i) => i.data.userId);
          // let indexmember = userarr.map((i) => i.id).indexOf(idfilter);

          // if (indexmember != -1 && store.state.profileRole == 2) {
          //   if (teamlead.length != 0) {
          //     for (let i = 0; i < teamlead.length; i++) {
          //       userarr.splice(
          //         userarr.map((i) => i.id).indexOf(teamlead[i]),
          //         1
          //       );
          //     }
          //   }
          //   console.log("tl");
          // } else if (indexmember != -1 && store.state.profileRole == 3) {
          //   for (let i = 0; i < teamlead.length; i++) {
          //     userarr.splice(userarr.map((i) => i.id).indexOf(teamlead[i]), 1);
          //   }
          //   console.log("oic");
          // }
          // console.log(userarr);
          // return userarr;
        });
      });
  },
  userfilter(users) {
    let idfilter = users
      .filter((i) => i.id == store.state.profileUserId)
      .map((i) => i.id)
      .toString();
    let teamlead = store.state.DBUsers.filter(
      (i) => i.data.groupId === store.state.profileGroupId && i.data.role <= 2
    ).map((i) => i.data.userId);
    let indexmember = users.map((i) => i.id).indexOf(idfilter);

    if (indexmember != -1 && store.state.profileRole == 2) {
      if (teamlead.length != 0) {
        for (let i = 0; i < teamlead.length; i++) {
          users.splice(users.map((i) => i.id).indexOf(teamlead[i]), 1);
        }
      }
      console.log("tl");
    } else if (indexmember != -1 && store.state.profileRole == 3) {
      for (let i = 0; i < teamlead.length; i++) {
        users.splice(users.map((i) => i.id).indexOf(teamlead[i]), 1);
      }
      console.log("oic");
    }
    console.log(users);
    return users;
  },
  approvedtasks: computed(() => {
    return store.state.profileRole <= 3
      ? store.state.DBReviewedTasks.filter(
          (d) =>
            (d.data.reviewby.includes(store.state.profileUserId) ||
              d.data.responsibleId.includes(store.state.profileUserId)) &&
            d.data.groupid === store.state.profileGroupId
        )
      : store.state.DBReviewedTasks.filter(
          (d) =>
            d.data.responsibleId.includes(store.state.profileUserId) &&
            d.data.groupid === store.state.profileGroupId
        );
  }),
  async tasks(query) {
    return await http.get(query).then(async (r) => {
      const tasks = r.data.data;
      return this.taskbybr(tasks).then((r) => {
        console.log(r);
        return { tasks: tasks, taskbybr: r };
      });
    });
  },
  async taskbybr(tasks) {
    return await this.querytaskfolders(tasks).then((r) => {
      return r;
    });
  },
  async querytaskfolders(tasks) {
    const parentfolder = tasks.map((p) => p.superParentIds);
    const folder = tasks.map((f) => f.parentIds);
    const TaskFolder = [];
    for (let i = 0; i < tasks.length; i++) {
      if (
        parentfolder[i].length === 0 &&
        folder[i] !== store.state.wrikerootfolder
      ) {
        TaskFolder.push(folder[i]);
      } else {
        TaskFolder.push(parentfolder[i]);
      }
    }

    return await http
      .get(`folders/${TaskFolder}` || `tasks/${TaskFolder}`)
      .then((r) => {
        // return r.data.data.flat();
        const tbybr = ref([]);
        const cf = r.data.data.filter(
          (c) => c.customFields != ("" || undefined || null)
        );
        const br = store.state.profileBrands.flat();
        if (br.length == 0) {
          tbybr.value = cf.flat();
        } else {
          const taskbrandsorted = [];
          for (let b = 0; b < br.length; b++) {
            taskbrandsorted.push(
              cf.filter((c) =>
                c.customFields.some((v) => v.value.includes(br[b]))
              )
            );
          }
          tbybr.value = taskbrandsorted.flat();
        }
        return tbybr.value;
      });
    // .catch((err) => {
    //   console.log(err);
    // })
    // .finally(() => {
    //   load.value = false;
    // });
  },
  querybrands: computed(() => {
    const br = store.state.profileBrands.flat().concat("All");
    const brandarr = [];
    for (let i = 0; i < br.length; i++) {
      const obj = {
        id: i,
        title: br[i],
      };
      brandarr.push(obj);
    }
    return brandarr.sort((a, b) => a.title.localeCompare(b.title));
  }),
};

export default get;
