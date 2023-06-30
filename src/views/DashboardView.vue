<template>
  <tilesfilter-layout
    :loading="loading"
    :contentclass="`items-start grid grid-cols-3 gap-10 font-medium text-base px-4 py-8`"
  >
    <!-- <LoadingC /> -->
    <template #headertitle>
      <span>Dashboard</span>
    </template>
    <template #headerright>
      <div v-if="showcalendar == true">
        <CalendarC @check="getdate" class="px-2" />
      </div>
      <div v-else-if="monthlist == true">
        <ListWithId
          :id="monthid"
          :options="month"
          class="z-30 px-2"
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
    <template #content>
      <dashboard-layout
        :tasks="tasks"
        :tasksortedbybrand="tasksortedbybrand"
        :members="members"
        :date="date"
        :nofoundtask="nofoundtask"
        :tasktotal="tasktotal == 0"
        :rl="[
          {
            aftercontent: store.state.jsondashwf
              .filter((i) => i.id == wfactive)
              .map((t) => t.title)
              .toString(),
            to: {
              name: 'internalreview',
              query: {
                pick: picked,
                date: sortdate,
              },
            },
            rlclass:
              wfactive == 'IEADVMHZJMBRONOY' &&
              pickedtasks == 'Team' &&
              isAuthorized,
            total: tasktotal,
            access: store.state.profileRole <= 3 ? true : false,
            svgclass: 'w-6 h-6',
            svgd: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
          },
          {
            aftercontent: 'Approved Tasks',
            to: {
              name: 'approved',
              query: {
                pick: picked,
                date: sortdate,
              },
            },
            rlclass: pickedtasks == 'Team' && approvedtasksarr.length > 0,
            total: approvedtasksarr.length,
            access: true,
            svgclass: 'w-6 h-6',
            svgd: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75',
          },
          {
            aftercontent: 'Users',
            to: { name: 'users' },
            rlclass: true,
            total: usersdb.length,
            access: store.state.profileRole <= 2 ? true : false,
            svgclass: 'w-6 h-6',
            svgd: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
          },
        ]"
      >
        <template #contentheader>
          <div class="flex">
            <span v-if="isAuthorized" class="flex border-r pr-2">
              <label
                v-for="p in picktasks"
                :key="p.name"
                class="flex items-center text-sm"
                @change="changetasks"
              >
                <input
                  type="radio"
                  :value="p.name"
                  v-model="pickedtasks"
                  class="hidden"
                />
                <span
                  :class="
                    pickedtasks == p.name
                      ? 'bg-purple-900 text-white relative inline-flex items-center mx-1 cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none'
                      : 'bg-white relative inline-flex items-center mx-1 cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none hover:text-white hover:bg-purple-900 transition duration-150 ease-in-out'
                  "
                  >{{ p.name }}</span
                >
              </label>
            </span>
            <div
              class="bg-grey shadow-md font-medium text-sm px-4 py-2 rounded-md mx-3"
            >
              {{
                store.state.jsondashwf
                  .filter((i) => i.id == wfactive)
                  .map((t) => t.title)
                  .toString()
              }}
            </div>
          </div>
          <div class="flex workflows justify-end py-4">
            <span
              @click.prevent="pickwf(w.id)"
              v-for="w in wf"
              :key="w.id"
              class="w-4 h-4 inline-block m-1 rounded-full shadow-md relative group cursor-pointer"
              :style="
                wfactive == w.id
                  ? `background-color: ${w.bgcolor}`
                  : `border: 0.8px solid ${w.bgcolor}`
              "
              ><span
                class="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-36 right-[-3.5rem] top-[-2rem]"
              >
                <span
                  class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded-md shadow-md"
                  >{{ w.title }}</span
                >
              </span></span
            >
          </div>
        </template>
        <!-- <div class="p-4">{{ nofoundtask }}</div> -->
        <!-- <template #content>
          <div class="grid grid-rows-4 grid-flow-col gap-6 px-5">
            <div
              class="flex justify-center drop-shadow-md rounded-md relative bg-white px-10 pt-9 pb-4 before:text-gray-400 before:content-['Date'] before:absolute before:text-sm before:top-2"
            >
              <span
                class="w-full before:content-[''] before:block before:border-b before:mb-3"
                ><span class="flex justify-center">{{ date }}</span></span
              >
            </div>
            <div
              class="flex justify-center drop-shadow-md rounded-md relative bg-white px-10 pt-9 pb-4 before:text-gray-400 wfbf before:absolute before:text-sm before:top-2"
              :style="`--content-p: '${store.state.jsondashwf
                .filter((i) => i.id == wfactive)
                .map((t) => t.title)
                .toString()}'`"
            >
              <span
                class="w-full before:content-[''] before:block before:border-b before:mb-3"
              >
                <router-link
                  :to="{
                    name: 'internalreview',
                    query: {
                      pick: picked,
                      date: sortdate,
                    },
                  }"
                  class="flex justify-center"
                  :class="
                    wfactive == 'IEADVMHZJMBRONOY' &&
                    pickedtasks == 'Team' &&
                    isAuthorized
                      ? ''
                      : 'pointer-events-none'
                  "
                >
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  </span>
                  <span class="px-3">{{ tasktotal }}</span>
                </router-link>
              </span>
            </div>
            <div
              class="flex justify-center drop-shadow-md rounded-md relative bg-white px-10 pt-9 pb-4 before:text-gray-400 before:content-['Approved_Tasks'] before:absolute before:text-sm before:top-2"
            >
              <span
                class="w-full before:content-[''] before:block before:border-b before:mb-3"
              >
                <router-link
                  :to="{
                    name: 'approved',
                    query: {
                      pick: picked,
                      date: sortdate,
                    },
                  }"
                  class="flex justify-center"
                  :class="pickedtasks == 'Team' ? '' : 'pointer-events-none'"
                >
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                      />
                    </svg>
                  </span>
                  <span class="px-3">{{ approvedtasksarr.length }}</span>
                </router-link>
              </span>
            </div>
            <div
              v-if="isAdmin"
              class="flex justify-center drop-shadow-md rounded-md relative bg-white px-10 pt-9 pb-4 before:text-gray-400 before:content-['Users'] before:absolute before:text-sm before:top-2"
            >
              <span
                class="w-full before:content-[''] before:block before:border-b before:mb-3"
              >
                <router-link
                  :to="{ name: 'users' }"
                  class="flex justify-center"
                >
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                  </span>
                  <span class="px-3">{{ usersdb.length }}</span>
                </router-link>
              </span>
            </div>
          </div>
        </template> -->
      </dashboard-layout>
    </template>
  </tilesfilter-layout>
</template>

<script setup>
import store from "@/store";
import get from "@/functions/get";
import moment from "moment";
// import http from "../../http";
import { ref, computed, onMounted } from "vue";

import CalendarC from "@/components/CalendarC.vue";
import ListWithId from "@/components/form/ListWithId.vue";
// import LoadingC from "@/components/LoadingC.vue";
import TilesfilterLayout from "@/components/layout/TilesfilterLayout.vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";

const wfactive = ref("IEADVMHZJMBRONOE");
const usersdb = ref([]);
const members = ref([]);
const loading = ref(false);
const nofoundtask = ref("");
const tasks = ref([]);
const tasksortedbybrand = ref([]);
const tasktotal = ref(0);
const resIds = ref([]);
const groupids = ref([]);
const wf = computed(() => store.state.jsondashwf);
// const approvedtasksarr = ref([]);

const date = ref(moment(new Date()).format("MMMM Do YYYY"));
const sortdate = ref(moment().format("YYYY-MM-DD"));
const pick = [{ name: "Daily" }, { name: "This week" }, { name: "Monthly" }];
const picked = ref("Daily");
const showcalendar = ref(true);
const monthlist = ref(true);
const monthid = ref(0);
const thisweek = ref(true);
const thisweekrange = ref(get.thisweek.value);
const month = ref(get.month.value);

const picktasks = [{ name: "Team" }, { name: "My Tasks" }];
const pickedtasks = ref("Team");
const pickgroup = ref(true);
const pickmytasks = ref(true);

// const isAuthorized = get.isAuthorized;
// const isAdmin = get.isAdmin;

const getdate = (val) => {
  sortdate.value = moment(val).format("YYYY-MM-DD");
  date.value = moment(val).format("MMMM Do YYYY");
  gettasksdata(resIds.value, sortdate.value, wfactive.value);
};

// const displaydate = (val) => {
//   return moment(val).format("MMM Do 'YY");
// };

const isAuthorized = computed(() => {
  return store.state.profileRole <= 3;
});
// const isAdmin = computed(() => {
//   return store.state.profileRole <= 2;
// });

onMounted(async () => {
  await store.dispatch("getDBUsers");
  await store.dispatch("getDBReviewedTasks");

  usersdb.value = get.usersdb.value;
  if (store.state.profileRole == 4) {
    await store.dispatch("getWrikeUserData", store.state.profileUserId);
    members.value = store.state.wrikeUser.data;
    resIds.value = store.state.profileUserId;
    gettasksdata(resIds.value, sortdate.value, wfactive.value);
  } else {
    Promise.resolve(get.wrikeusers()).then((r) => {
      members.value = r;
      resIds.value = members.value.map((i) => i.id);
      gettasksdata(resIds.value, sortdate.value, wfactive.value);
    });
  }
});

const changetasks = async () => {
  if (pickedtasks.value == "Team") {
    pickgroup.value = true;
    pickmytasks.value = false;
    members.value = groupids.value;
    resIds.value = groupids.value.map((i) => i.id);
    gettasksdata(resIds.value, sortdate.value, wfactive.value);
  } else {
    pickgroup.value = false;
    pickmytasks.value = true;
    await store.dispatch("getWrikeUserData", store.state.profileUserId);
    members.value = store.state.wrikeUser.data;
    resIds.value = store.state.profileUserId;
    gettasksdata(resIds.value, sortdate.value, wfactive.value);
  }
};

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
  console.log(JSON.stringify(sortdate.value));
  gettasksdata(resIds.value, sortdate.value, wfactive.value);
};

const pickwf = (val) => {
  wfactive.value = val;
  gettasksdata(resIds.value, sortdate.value, val);
};

const changepick = () => {
  console.log(picked.value);
  if (picked.value == "This week") {
    showcalendar.value = false;
    monthlist.value = false;
    thisweek.value = true;
    date.value =
      moment().startOf("week").format("MMM Do") +
      " - " +
      moment().endOf("week").format("MMM Do 'YY");
    sortdate.value = JSON.stringify({
      start: `${moment().startOf("week").format("YYYY-MM-DD")}`,
      end: `${moment().endOf("week").format("YYYY-MM-DD")}`,
    });
    gettasksdata(resIds.value, sortdate.value, wfactive.value);
    console.log(resIds.value);
  } else if (picked.value == "Monthly") {
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
    gettasksdata(resIds.value, sortdate.value, wfactive.value);
  } else {
    showcalendar.value = true;
    monthlist.value = false;
    thisweek.value = false;
    date.value = moment().format("MMMM Do YYYY");
    sortdate.value = moment().format("YYYY-MM-DD");
    gettasksdata(resIds.value, sortdate.value, wfactive.value);
    console.log(date.value);
  }
};

const approvedtasksarr = computed(() => {
  // const getapproved = computed(() => get.approvedtasks()).value;
  const getapproved = get.approvedtasks.value;
  console.log(sortdate.value);
  return showcalendar.value == true
    ? sortdate.value === moment(new Date()).format("YYYY-MM-DD")
      ? getapproved
          .flat()
          .filter(
            (d) =>
              new Date(d.data.date).toISOString().slice(0, 10) ==
              new Date().toISOString().slice(0, 10)
          )
      : getapproved
          .flat()
          .filter(
            (d) =>
              new Date(d.data.date).toISOString().slice(0, 10) == sortdate.value
          )
    : thisweek.value == true
    ? getapproved
        .flat()
        .filter(
          (d) =>
            new Date(d.data.date).toISOString().slice(0, 10) >=
              thisweekrange.value.map((s) => s.start)[0] &&
            new Date(d.data.date).toISOString().slice(0, 10) <=
              thisweekrange.value.map((s) => s.end)[0]
        )
    : getapproved
        .flat()
        .filter(
          (d) =>
            new Date(d.data.date).toISOString().slice(0, 10) >=
              month.value
                .filter((i) => i.id == monthid.value)
                .map((s) => s.start)[0] &&
            new Date(d.data.date).toISOString().slice(0, 10) <=
              month.value
                .filter((i) => i.id == monthid.value)
                .map((s) => s.end)[0]
        );
});

async function gettasksdata(ids, date, wf) {
  // console.log(ids);
  // {"start":"2023-02-22","end":"2023-02-23"}
  loading.value = true;
  const query = `tasks?responsibles=[${ids}]&fields=[responsibleIds, parentIds, superParentIds]&scheduledDate=${date}&customStatuses=["${wf}"]`;
  get
    .tasks(query)
    .then((r) => {
      if (r.tasks == 0) {
        nofoundtask.value = "No task.";
        tasktotal.value = 0;
        tasks.value = null;
        loading.value = false;
      }
      tasks.value = r.tasks;
      tasksortedbybrand.value = r.taskbybr;
      tasksortedbybrand.value == 0
        ? (nofoundtask.value = "No task.")
        : (nofoundtask.value = "");
      const tsbid = tasksortedbybrand.value.map((i) => i.id);
      const tsbarr = [];
      for (let y = 0; y < tsbid.length; y++) {
        tsbarr.push(
          tasks.value.filter(
            (i) => i.superParentIds == tsbid[y] || i.parentIds == tsbid[y]
          )
        );
      }
      tasktotal.value = tsbarr.flat().length;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style lang="scss" scoped>
span.spch:nth-child(n) {
  margin-left: -20px;
}
// span.spch:first-child {
//   margin-left: 0px;
// }
.wfbf::before {
  content: var(--content-p);
}
</style>
