<template>
  <tilesfilter-layout
    :loading="loading"
    :bruser="true"
    :contentclass="`flex-wrap items-center py-5`"
  >
    <template #headertitle>
      <span class="pr-4 border-r">{{ date }}</span>
      <span class="text-green-700 pl-4">For Internal Approval</span>
    </template>
    <template #headerright>
      <div v-if="showcalendar">
        <CalendarC @check="getdate" :qdate="qdate" class="px-2" />
      </div>
      <div v-else-if="monthlist">
        <ListWithId
          :id="monthid"
          :options="month"
          class="z-[101] px-2 relative"
          :classes="`w-[12rem] `"
          @selected="selectedmonth"
        />
      </div>
      <div class="flex pl-2 border-l">
        <label
          v-for="p in pick"
          :key="p.name"
          class="flex items-center text-sm"
          @change="changepick"
        >
          <input type="radio" :value="p.name" v-model="picked" class="hidden" />
          <span
            :class="
              picked == p.name
                ? 'bg-purple-900 text-white relative inline-flex items-center mx-1 cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none'
                : 'bg-white relative inline-flex items-center mx-1 cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none hover:text-white hover:bg-purple-900 transition duration-150 ease-in-out'
            "
            >{{ p.name }}</span
          >
        </label>
      </div>
    </template>
    <template #headerbruser>
      <ComboBox
        :options="querybrands"
        :placeholder="`Brands`"
        @selectedtitle="fetchBr"
        :zindex="showcalendar == true ? 'z-[9]' : `z-[100]`"
        class="w-[250px] mx-1"
      />
      <ComboBoxUsers
        :options="
          users
            .concat({ id: 0, firstName: 'All', lastName: '' })
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
        "
        :placeholder="`Members`"
        :zindex="showcalendar == true ? 'z-[9]' : `z-[100]`"
        @selected="selectedUser"
        class="selectuser mx-1"
      />
    </template>
    <template #content>
      <template v-for="(t, i) in tasks" :key="t.id">
        <div
          v-for="task in querytasks
            .flat()
            .filter((i) => i.id == t.parentIds || i.id == t.superParentIds)"
          :key="task.id"
          class="flex items-center w-max bg-white border border-gray-200 rounded-lg drop-shadow-md p-5 m-3"
          :style="`z-index: ${tasks.length - i}`"
        >
          <!-- <a :href="t.permalink"></a> -->
          <!-- <div v-for="tr in t.responsibleIds" :key="tr"> -->
          <!-- <span
                v-for="u in users.filter((i) => i.id === t.responsibleIds[0])"
                :key="u.id"
              >
                <div class="relative inline-block group">
                  <div class="flex flex-col items-center">
                    <img
                      class="w-12 h-12 rounded-full"
                      :src="u.avatarUrl"
                      alt=""
                    />
                  </div>
                  <div
                    class="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-32 right-[-2.5rem] top-[-2rem]"
                  >
                    <span
                      class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded-md shadow-md"
                      >{{ u.firstName }} {{ u.lastName }}</span
                    >
                    <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                  </div>
                </div>
              </span>
              <div class="mx-3 flex flex-col self-center">
                <div
                  class="text-sm font-medium whitespace-nowrap overflow-hidden text-elipsis max-w-[12rem] md:max-w-[10rem] sm:max-w-[9rem]"
                >
                  {{ t.title }}
                </div>
                <div
                  class="text-xs font-medium flex justify-between items-center py-1"
                >
                  <span class="mr-1">
                    {{
                      task.customFields
                        .filter(
                          (i) => i.id === this.$store.state.wrikeCustomFields
                        )
                        .map((v) => v.value)[0]
                    }}
                  </span>
                </div>
              </div> -->
          <tiles-content
            :arr="users.filter((i) => i.id === t.responsibleIds[0])"
            :title="t.title"
            :brand="
              task.customFields
                .filter((i) => i.id === this.$store.state.wrikeCustomFields)
                .map((v) => v.value)[0]
            "
          />
          <!-- menu -->
          <menu-layout
            :href="t.permalink"
            :atitle="`Go to Wrike`"
            :to="{ name: 'taskreview', params: { taskId: t.id } }"
            :rltitle="`Review`"
          />
        </div>
      </template>
      <div class="p-4">{{ nofoundtask }}</div>
      <!-- <PaginationC :items="this.tasksortedbybrand" :perpage="perpage" /> -->
    </template>
  </tilesfilter-layout>
</template>

<script setup>
// import http from "../../http";
import moment from "moment";
import store from "@/store";
import get from "@/functions/get";

import { useRoute } from "vue-router";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";

import ComboBox from "@/components/form/ComboBox.vue";
import ComboBoxUsers from "@/components/form/ComboBoxUsers.vue";
// import LoadingC from "@/components/LoadingC.vue";
import CalendarC from "@/components/CalendarC.vue";
import TilesfilterLayout from "@/components/layout/TilesfilterLayout.vue";
import ListWithId from "@/components/form/ListWithId.vue";
import MenuLayout from "@/components/layout/MenuLayout.vue";
import TilesContent from "@/components/layout/TilesContent.vue";
// import PaginationC from "@/components/PaginationC.vue";

const users = ref([]);
// const date = ref("");
const loading = ref(false);
const nofoundtask = ref("");
const tasks = ref([]);
const tasksortedbybrand = ref([]);
const brand = ref("");
const timer = ref(0);
const user = ref();

const route = useRoute();
const querypick = route.query.pick;
const querydate = route.query.date;
const url = window.location.href;
const qdate = ref("");

const date = ref(moment(new Date()).format("MMMM Do YYYY"));
const sortdate = ref(new Date().toISOString().slice(0, 10));
const pick = [{ name: "Daily" }, { name: "This week" }, { name: "Monthly" }];
const picked = ref("Daily");
const showcalendar = ref(true);
const monthlist = ref(true);
const thisweek = ref(true);
const thisweekrange = ref(get.thisweek.value);
const month = ref(get.month.value);
const querybrands = ref(get.querybrands.value);

const changequery = (pick, date) => {
  window.history.replaceState(null, null, `?pick=${pick}&date=${date}`);
};

const monthid = ref(0);
const selectedmonth = (id) => {
  monthid.value = id;
  date.value = moment(
    month.value.filter((i) => i.id == id).map((s) => s.start)[0]
  )
    .subtract("month")
    .format("MMMM 'YY");
  sortdate.value = JSON.stringify({
    start: `${month.value.filter((i) => i.id == id).map((s) => s.start)[0]}`,
    end: `${month.value.filter((i) => i.id == id).map((s) => s.end)[0]}`,
  });
  if (url.includes("?")) {
    changequery(picked.value, sortdate.value);
  }
  gettasksdata(sortdate.value, user.value);
};

timer.value = setInterval(() => {
  console.log(sortdate.value);
  gettasksdata(sortdate.value, user.value);
}, 50000);

onMounted(async () => {
  Promise.resolve(get.wrikeusers()).then((r) => {
    users.value = r;
    console.log(users.value);
    const resIds = users.value.map((i) => i.id);
    gettasksdata(new Date().toISOString().slice(0, 10), resIds);
  });
  if (url.includes("?")) {
    picked.value = querypick;
    sortdate.value = querydate;
    changepick(picked.value);
  } else {
    sortdate.value = new Date().toISOString().slice(0, 10);
  }
});

// const initials = (val) => {
//   return val
//     .match(/(^\S\S?|\b\S)?/g)
//     .join("")
//     .match(/(^\S|\S$)?/g)
//     .join("")
//     .toUpperCase();
// };

// const getcolor = (val) => {
//   return store.state.jsonBr.filter((i) => i.title == val).map((c) => c.color);
// };

const selectedUser = (id) => {
  console.log(id);
  gettasksdata(sortdate.value, id);
};

const getdate = (val) => {
  sortdate.value = moment(val).format("YYYY-MM-DD");
  date.value = moment(val).format("MMMM Do YYYY");
  if (url.includes("?")) {
    changequery(picked.value, sortdate.value);
  }
  gettasksdata(sortdate.value, user.value);
};

const changepick = (val) => {
  console.log(picked.value);
  if (picked.value == "This week" || val == "This week") {
    showcalendar.value = false;
    monthlist.value = false;
    thisweek.value = true;
    date.value =
      moment().startOf("week").format("MMM Do") +
      " - " +
      moment().endOf("week").format("MMM Do 'YY");
    sortdate.value = JSON.stringify({
      start: `${thisweekrange.value.map((s) => s.start)[0]}`,
      end: `${thisweekrange.value.map((s) => s.end)[0]}`,
    });
    if (url.includes("?")) {
      // sortdate.value = querydate;
      changequery(picked.value, sortdate.value);
    }
    gettasksdata(sortdate.value, user.value);
  } else if (picked.value == "Monthly" || val == "Monthly") {
    showcalendar.value = false;
    monthlist.value = true;
    thisweek.value = false;
    date.value = moment(
      month.value.filter((i) => i.id == monthid.value).map((s) => s.start)[0]
    )
      .subtract("month")
      .format("MMMM 'YY");
    sortdate.value = JSON.stringify({
      start: `${
        month.value.filter((i) => i.id == monthid.value).map((s) => s.start)[0]
      }`,
      end: `${
        month.value.filter((i) => i.id == monthid.value).map((s) => s.end)[0]
      }`,
    });
    console.log(date.value);
    if (url.includes("?")) {
      sortdate.value = querydate;
      changequery(picked.value, sortdate.value);
      monthid.value = month.value
        .filter((s) => s.start == JSON.parse(sortdate.value).start)
        .map((i) => i.id)[0];
      date.value = moment(JSON.parse(sortdate.value).start)
        .subtract("month")
        .format("MMMM 'YY");
    }
    gettasksdata(sortdate.value, user.value);
  } else if (picked.value == "Daily" || val == "Daily") {
    showcalendar.value = true;
    monthlist.value = false;
    thisweek.value = false;
    sortdate.value = moment().format("YYYY-MM-DD");
    date.value = moment(sortdate.value).format("MMMM Do YYYY");
    console.log(url);
    if (url.includes("?")) {
      // sortdate.value = querydate;
      changequery(picked.value, sortdate.value);
      qdate.value = sortdate.value;
      date.value = moment(sortdate.value).format("MMMM Do YYYY");
    }
    gettasksdata(sortdate.value, user.value);
  }
};

const gettasksdata = (val, id) => {
  console.log(date.value);
  // sortdate.value.length == 0
  //   ? (sortdate.value = new Date().toISOString().slice(0, 10))
  //   : (sortdate.value = moment(val).format("YYYY-MM-DD"));

  id === undefined || id === 0
    ? (user.value = users.value.map((i) => i.id))
    : (user.value = id);

  // sortdate.value == moment(new Date()).format("YYYY-MM-DD")
  //   ? (sortdate.value = moment(new Date()).format("YYYY-MM-DD"))
  //   : (sortdate.value = val);

  fetch(user.value, val);
};

async function fetch(ids, date) {
  console.log(sortdate.value);
  const d = ref("");
  if (url.includes("?")) {
    d.value = sortdate.value;
  } else {
    d.value = date;
  }
  // {"start":"2023-02-22","end":"2023-02-23"}
  loading.value = true;
  const query = `tasks?responsibles=[${ids}]&fields=[responsibleIds, parentIds, superParentIds]&scheduledDate=${d.value}&customStatuses=["${store.state.wrikeInternalReview}"]`;
  console.log(query);
  // get
  //   .tasks(query)
  //   .then((r) => {
  //     if (r == 0) {
  //       console.log("no tasks.");
  //       nofoundtask.value = "No task to review.";
  //       tasks.value = null;
  //       loading.value = false;
  //     } else {
  //       nofoundtask.value = "";
  //       console.log(r);
  //       tasks.value = r;

  //       const parentfolder = tasks.value.map((p) => p.superParentIds);
  //       const folder = tasks.value.map((f) => f.parentIds);
  //       const TaskFolder = [];
  //       for (let i = 0; i < tasks.value.length; i++) {
  //         if (
  //           parentfolder[i].length === 0 &&
  //           folder[i] !== store.state.wrikerootfolder
  //         ) {
  //           TaskFolder.push(folder[i]);
  //         } else {
  //           TaskFolder.push(parentfolder[i]);
  //         }
  //       }

  //       http
  //         .get(`folders/${TaskFolder}` || `tasks/${TaskFolder}`)
  //         .then((r) => {
  //           const cf = r.data.data.filter(
  //             (c) => c.customFields != ("" || undefined || null)
  //           );
  //           const br = store.state.profileBrands.flat();
  //           const taskbrandsorted = [];
  //           for (let b = 0; b < br.length; b++) {
  //             taskbrandsorted.push(
  //               cf.filter((c) =>
  //                 c.customFields.some((v) => v.value.includes(br[b]))
  //               )
  //             );
  //           }
  //           tasksortedbybrand.value = taskbrandsorted.flat();
  //           tasksortedbybrand.value == 0
  //             ? (nofoundtask.value = "No task to review.")
  //             : (nofoundtask.value = "");
  //           console.log(tasksortedbybrand.value);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         })
  //         .finally(() => {
  //           loading.value = false;
  //         });
  //     }
  //     // console.log(r);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  get
    .tasks(query)
    .then((r) => {
      // console.log(r.t.value);
      if (r.tasks == 0) {
        nofoundtask.value = "No task.";
        tasks.value = null;
        loading.value = false;
      }
      tasks.value = r.tasks;
      tasksortedbybrand.value = r.taskbybr;
      tasksortedbybrand.value == 0
        ? (nofoundtask.value = "No task.")
        : (nofoundtask.value = "");
      // const tsbid = tasksortedbybrand.value.map((i) => i.id);
      // const tsbarr = [];
      // for (let y = 0; y < tsbid.length; y++) {
      //   tsbarr.push(
      //     tasks.value.filter(
      //       (i) => i.superParentIds == tsbid[y] || i.parentIds == tsbid[y]
      //     )
      //   );
      // }
      // tasktotal.value = tsbarr.flat().length;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
  // http.get(query).then((r) => {
  //   if (r.data.data.length == 0) {
  //     nofoundtask.value = "No task to review.";
  //     console.log(nofoundtask.value);
  //     tasks.value = null;
  //     loading.value = false;
  //   } else {
  //     const ids = r.data.data.map((i) => i.id);
  //     store
  //       .dispatch("getWrikeTaskData", ids)
  //       .then((r) => {
  //         tasks.value = r.data.data;

  //         tasks.value.length === 0
  //           ? (nofoundtask.value = "No task to review.")
  //           : (nofoundtask.value = "");
  //         console.log(tasks.value);

  //         const parentfolder = tasks.value.map((p) => p.superParentIds);
  //         const folder = tasks.value.map((f) => f.parentIds);
  //         const TaskFolder = [];
  //         for (let i = 0; i < tasks.value.length; i++) {
  //           if (
  //             parentfolder[i].length === 0 &&
  //             folder[i] !== store.state.wrikerootfolder
  //           ) {
  //             TaskFolder.push(folder[i]);
  //           } else {
  //             TaskFolder.push(parentfolder[i]);
  //           }
  //         }

  //         http
  //           .get(`folders/${TaskFolder}` || `tasks/${TaskFolder}`)
  //           .then((r) => {
  //             const cf = r.data.data.filter(
  //               (c) => c.customFields != ("" || undefined || null)
  //             );
  //             const br = store.state.profileBrands.flat();
  //             const taskbrandsorted = [];
  //             for (let b = 0; b < br.length; b++) {
  //               taskbrandsorted.push(
  //                 cf.filter((c) =>
  //                   c.customFields.some((v) => v.value.includes(br[b]))
  //                 )
  //               );
  //             }
  //             tasksortedbybrand.value = taskbrandsorted.flat();
  //             tasksortedbybrand.value == 0
  //               ? (nofoundtask.value = "No task to review.")
  //               : (nofoundtask.value = "");
  //             console.log(tasksortedbybrand.value);
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           })
  //           .finally(() => {
  //             loading.value = false;
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // });
}

const fetchBr = (val) => {
  brand.value = val;
  tasksortedbybrand.value.filter((c) =>
    c.customFields.some((v) => v.value.includes(brand.value))
  ).length == 0
    ? (nofoundtask.value = "No task to review.")
    : (nofoundtask.value = "");
};

const querytasks = computed(() => {
  return brand.value == ("" || undefined || null || "All")
    ? tasksortedbybrand.value
    : tasksortedbybrand.value.filter((c) =>
        c.customFields.some((v) => v.value.includes(brand.value))
      );
});

// const displaydate = computed(() => {
//   return moment(date.value).format("MMMM Do YYYY");
// });

const cancelAutoUpdate = () => {
  clearInterval(timer.value);
};

onBeforeUnmount(() => {
  cancelAutoUpdate();
});
</script>

<style lang="scss" scoped>
.selectuser {
  width: 17rem;
}
</style>
