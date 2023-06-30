<template>
  <form-layout>
    <ToasterC
      v-if="toastActive"
      :toastMsg="toastMsg"
      :btnarr="btnarr"
      v-on:close-toast="closeToast"
    />
    <div v-if="isnot" class="text-center m-auto w-full">
      {{ isnotmsg }}
    </div>
    <div v-else>
      <template v-for="t in task" :key="t.id">
        <card-layout :cheaderrightclass="`flex-col text-sm items-end`">
          <template #cheaderleft>
            <div class="task info">
              <div class="flex flex-col px-3">
                <p
                  class="text-md font-medium text-gray-900 py-2 flex items-center w-[30rem]"
                >
                  <a :href="t.permalink" target="_blank" class="flex">
                    <span class="icon text-gray-500 pr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        />
                      </svg>
                    </span>
                  </a>
                  {{ t.title }}
                </p>
                <div class="res flex items-center">
                  <div class="mr-3 flex" v-for="r in responsible" :key="r.id">
                    <div class="relative inline-block group">
                      <div class="flex flex-col items-center">
                        <img
                          class="w-8 h-8 rounded-full"
                          :src="r.avatarUrl"
                          alt=""
                        />
                      </div>
                      <div
                        class="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-32 right-[-3rem] bottom-[-4rem]"
                      >
                        <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                        <span
                          class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded-md shadow-lg top-[-0.5rem]"
                          >{{ r.firstName }} {{ r.lastName }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-900 font-medium">
                    <span class="border-x px-3">{{ brand }}</span>
                    <template v-for="wf in workoverflow" :key="wf.id">
                      <span
                        :class="`ml-3 px-2 py-0.5 rounded-md text-${wf.color}`"
                        :style="`background-color: ${wf.bgcolor}`"
                        >{{ wf.title }}</span
                      >
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </template>
          <template #cheaderright>
            <div class="flex text-gray-400">
              Task date: {{ date(t.dates.due) }}
            </div>
            <div
              v-if="
                sametasknumber.length == 0 &&
                amendtasks.length == 0 &&
                isreviewed.length == 0 &&
                parentamendtasks.length == 0
              "
              class="py-2 flex items-center"
              :class="
                selectedid.length != 0 ? 'pointer-events-none opacity-70' : ''
              "
            >
              <input
                type="checkbox"
                :value="isAmend"
                @change="changeAmend"
                class="h-4 w-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500 mr-1"
              />
              <label for="" class="text-gray-600 font-medium text-sm rg-lbl"
                >Amend Ticket</label
              >
            </div>
            <ComboBox
              :options="options"
              :placeholder="`Task Type`"
              class="w-[180px] z-20"
              :class="
                amendtasks.length > 0 || isoic == true || isAmend == true
                  ? 'pointer-events-none opacity-70'
                  : ''
              "
              @selectedid="selectedqaid"
            />
          </template>
          <template #ccontent>
            <div
              class="input z-10 relative mt-3 px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
            >
              <div v-if="selectedid.length === 0" class="text-center py-5">
                <div v-if="reviewedtasks.length > 0">
                  <div v-if="amendtasks.length > 0">
                    <span>This task has already been sorted as amend.</span>
                  </div>
                  <div v-else>
                    <div v-if="isAmend">
                      <div v-if="reviewedtaskarr.length > 0">
                        <span :class="errtextclass"
                          >Please select parent ticket for this amend:</span
                        >
                        <RadioGroup
                          :options="reviewedtaskarr"
                          @checked="checkedtask"
                          class="py-2"
                        />
                        <button
                          class="form"
                          @click.prevent="
                            saveamend(chtask, tasknumber, t.dates.due)
                          "
                        >
                          {{ !loading ? "Save" : "Saving..." }}
                        </button>
                      </div>
                    </div>
                    <div v-else>Please select type of task.</div>
                  </div>
                </div>
                <div v-else-if="isoic == true && initreview == false">
                  This task has already been reviewed by you
                  <router-link
                    :to="{
                      name: 'viewtaskreview',
                      params: { taskId: this.$route.params.taskId },
                    }"
                    class="font-medium hover:text-purple-600"
                    >here</router-link
                  >.
                </div>
                <div v-else-if="isoic == false && initreview == false">
                  {{ msg }}
                </div>
                <div v-else-if="isAmend && reviewedtaskarr.length == 0">
                  There's no same ticket number that's been evaluated.
                </div>
                <div v-else>{{ msg }}</div>
              </div>
              <!-- taskqa -->
              <div v-else>
                <TaskQA
                  :taskid="this.$route.params.taskId"
                  :tasktitle="t.title"
                  :tasklink="t.permalink"
                  :taskdue="t.dates.due"
                  :tasknumber="tasknumber"
                  :responsibleId="responsible.map((i) => i.id)[0]"
                  :brand="brand"
                  :selectedid="selectedid"
                  :selectedarr="selectedarr"
                  :qadesmgarr="qadesmgarr"
                  @checked="toast"
                />
              </div>
              <!-- taskqa -->
            </div>
          </template>
        </card-layout>
      </template>
    </div>
  </form-layout>
</template>

<script setup>
import store from "@/store";
import db from "@/firebase/init";
import moment from "moment";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";

import FormLayout from "@/components/layout/FormLayout.vue";
import CardLayout from "@/components/layout/CardLayout.vue";

import ToasterC from "@/components/ToasterC.vue";
import ComboBox from "@/components/form/ComboBox.vue";
import TaskQA from "@/components/TaskQA.vue";
import RadioGroup from "@/components/form/RadioGroup.vue";

const toastMsg = ref("Saved.");
const toastActive = ref(null);
const route = useRoute();
const router = useRouter();
const taskid = route.params.taskId;
const qadesmg = store.state.jsonqadesmg;
const grpid = store.state.profileGroupId;
const task = ref([]);
const brand = ref("");
const workoverflow = ref([]);
const responsible = ref([]);
const tasknumber = ref("");
const reviewedtasks = ref([]);
const reviewedtaskarr = ref([]);
const initreview = ref(false);
const msg = ref("");
const chtask = ref([]);
const options = ref([]);
const selectedid = ref("");
const selectedarr = ref([]);
const qadesmgarr = ref([]);
const errtextclass = ref("");
const isoic = ref(false);
const amendtasks = ref([]);
const parentamendtasks = ref([]);
const isreviewed = ref([]);
const isAmend = ref(false);
const sametasknumber = ref([]);
const isnot = ref(null);
const isnotmsg = ref("");
const loading = ref(false);
const btnarr = ref([
  {
    id: "view",
    title: "View",
    link: `/view-task/${taskid}`,
    class: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "gta",
    title: "Go to Approved",
    link: "/approved",
    class: "bg-gray-600 hover:bg-gray-700",
  },
]);
// const sametasknumberamend = ref(false);
console.log(chtask.value);

Promise.resolve(store.dispatch("getWrikeTaskData", taskid)).then((r) => {
  task.value = r.data.data;
  const superparent = task.value.map((s) => s.superParentIds)[0];
  const parent = task.value.map((p) => p.parentIds)[0];
  const resId = task.value.map((r) => r.responsibleIds);
  tasknumber.value = task.value.map(
    (c) =>
      c.customFields
        .filter((i) => i.id == "IEADVMHZJUABYMAX")
        .map((v) => v.value)[0]
  )[0];
  workoverflow.value = store.state.jsontaskworkflow.filter(
    (i) => i.id === task.value.map((s) => s.customStatusId)[0]
  );

  if (superparent.length == 0 && parent !== store.state.wrikerootfolder) {
    Promise.resolve(store.dispatch("getWrikeFolderData", parent)).then((r) => {
      // let folder = r.data.data;
      brand.value = r.data.data
        .map((c) => c.customFields)[0]
        .filter((i) => i.id == store.state.wrikeCustomFields)
        .map((v) => v.value)[0];
    });
  } else {
    Promise.resolve(store.dispatch("getWrikeFolderData", superparent)).then(
      (r) => {
        brand.value = r.data.data
          .map((c) => c.customFields)[0]
          .filter((i) => i.id == store.state.wrikeCustomFields)
          .map((v) => v.value)[0];
      }
    );
  }

  Promise.resolve(store.dispatch("getWrikeUserData", resId)).then((r) => {
    responsible.value = r.data.data;
  });
});

if (grpid === "KX724M7F") {
  options.value = qadesmg.parent.filter((c) => c.default != 1);
} else if (grpid === "KX724M7I") {
  options.value = qadesmg.parent.filter((c) => c.default != 1 && c.id == 5);
} else if (grpid === "KX724IUQ") {
  console.log("dev");
}

function selectedqaid(id) {
  selectedid.value = id;
  const def = qadesmg.parent.filter((i) => i.default === 1);
  const sel = qadesmg.parent.filter((i) => i.id === id);
  selectedarr.value = def.concat(sel);
  if (selectedid.value != 5) {
    qadesmgarr.value = qadesmg.parent
      .filter((i) => i.default === 1)
      .concat(qadesmg.parent.filter((i) => i.id === id));
  } else {
    qadesmgarr.value = qadesmg.parent.filter((i) => i.id === 5);
  }
}

const date = (d) => {
  return moment(d).format("MMM Do 'YY");
};

const checkedtask = (arr) => {
  chtask.value = arr;
  btnarr.value.filter(
    (i) => i.id == "view" && (i.link = `/view-task/${arr.id}`)
  );
  console.log(btnarr.value);
};

const changeAmend = () => {
  isAmend.value = !isAmend.value;
};

const toast = (val) => {
  console.log(val);
  toastActive.value = val;
};
const closeToast = () => {
  toastActive.value = null;
  router.push({ name: "approved" });
};
onMounted(async () => {
  await store.dispatch("getDBReviewedTasks");
  await store.dispatch("getDBAmendTasks");
  await store.dispatch("getWrikeGroupData", store.state.profileGroupId);

  amendtasks.value = store.state.DBAmendTask.filter(
    (d) => d.data.taskid == taskid
  );

  parentamendtasks.value = store.state.DBAmendTask.filter(
    (d) => d.data.parenttaskid == taskid
  );

  isreviewed.value = store.state.DBReviewedTasks.filter(
    (d) => d.data.taskid == taskid
  );

  sametasknumber.value = store.state.DBAmendTask.filter(
    (i) =>
      i.data.tasknumber == tasknumber.value &&
      (i.parenttaskid == taskid || i.taskid == taskid)
  );

  reviewedtasks.value = computed(() =>
    store.state.DBReviewedTasks.filter(
      (d) =>
        d.data.taskid !== taskid &&
        d.data.tasknumber === tasknumber.value &&
        d.data.groupid === grpid
    )
  ).value;
  for (let i = 0; i < reviewedtasks.value.length; i++) {
    const obj = {
      id: reviewedtasks.value[i].data.taskid,
      title: reviewedtasks.value[i].data.tasktitle,
      link: reviewedtasks.value[i].data.tasklink,
    };
    console.log(reviewedtasks.value[i].data.taskid);
    reviewedtaskarr.value.push(obj);
  }

  const reviewby = store.state.DBReviewedTasks.filter(
    (d) => d.data.taskid == taskid
  )
    .map((x) => x.data.reviewby)
    .flat();

  if (reviewby.includes(store.state.profileUserId)) {
    if (store.state.profileRole > 2) {
      isoic.value = true;
    } else {
      isoic.value = false;
      msg.value = "If you want to re-evalute this please select type of task.";
    }
  } else {
    initreview.value = true;
    msg.value = "Please select type of task.";
  }

  console.log(responsible.value.map((i) => i.id));
  console.log(
    store.state.wrikeGroup.data.map((m) =>
      m.memberIds.includes(responsible.value.map((i) => i.id)[0])
    )
  );
  // if (
  //   store.state.profileRole >= 2 &&
  //   store.state.wrikeGroup.data.map((m) =>
  //     m.memberIds.includes(responsible.value.map((i) => i.id)[0])
  //   )[0]
  // ) {
  //   isnot.value = true;
  //   isnotmsg.value = "This task is not part of your group.";
  //   console.log("notinclude");
  // }
  if (
    !store.state.wrikeGroup.data.map((m) =>
      m.memberIds.includes(responsible.value.map((i) => i.id)[0])
    )[0]
  ) {
    isnot.value = true;
    isnotmsg.value = "This task is not part of your group.";
    console.log("notinclude");
  }

  // const btntaskid = computed(() => {
  //   return !isAmend.value ? taskid : reviewedtaskarr.value.map((i) => i.id);
  // }).value;

  // console.log(btntaskid);
  // console.log(reviewedtaskarr.value.map((i) => i.id));
});

async function saveamend(arr, id, date) {
  loading.value = true;
  if (arr.length == 0) {
    console.log("select");
    errtextclass.value = "text-red-500 font-medium";
    loading.value = false;
  } else {
    await db.collection("amendtasks").add({
      taskid: taskid,
      tasknumber: id,
      parenttaskid: arr.id,
      brand: brand.value,
      title: arr.title,
      tasklink: arr.link,
      taskdue: date,
      date: moment(new Date()).format(),
    });
    toast(true);
    loading.value = false;
    // router.push({ name: "approved" });
  }
}
</script>

<style lang="scss" scoped>
.form-wrap.auth {
  height: auto;

  form {
    justify-content: flex-start;
    align-items: flex-start;

    .inputs {
      max-width: initial;

      .input {
        margin: 16px 0;
        display: block;

        input {
          width: 100%;
        }
      }
    }
  }
}
button {
  align-self: center;
}
.card-header::after {
  content: "";
  background-color: #f3f3f3;
  width: 100%;
  height: 2px;
  display: block;
  margin: 20px 0;
}
</style>
