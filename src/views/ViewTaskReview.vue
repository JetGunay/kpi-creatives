<template>
  <form-layout>
    <ModalC
      v-if="modalActive"
      :loggedtaskarr="loggedtaskarr"
      :loggedtaskqaid="loggedtaskqaid"
      :defchoices="defchoices"
      v-on:close-modal="closeModal"
    />
    <div v-if="isnot" class="text-center m-auto w-full">
      {{ isnotmsg }}
    </div>
    <div v-else class="w-full">
      <template v-for="t in tasks" :key="t.data.id">
        <card-layout
          :cheaderclass="`gap-4`"
          :cheaderrightclass="`flex-col items-end text-sm text-gray-900 font-medium w-[12rem]`"
        >
          <template #cheaderleft>
            <div class="task info">
              <div class="flex flex-col px-3">
                <p
                  class="text-md font-medium text-gray-900 py-2 flex items-center"
                >
                  <a :href="t.data.tasklink" target="_blank" class="flex">
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
                  {{ t.data.tasktitle }}
                </p>
                <!-- {{ tasks }} -->
                <div class="res flex items-center">
                  <div class="mr-3 flex" v-for="u in responsible" :key="u.id">
                    <div class="relative inline-block group">
                      <div class="flex flex-col items-center">
                        <img
                          class="w-8 h-8 rounded-full"
                          :src="u.avatarUrl"
                          alt=""
                        />
                      </div>
                      <div
                        class="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-32 right-[-3rem] bottom-[-4rem]"
                      >
                        <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                        <span
                          class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded-md shadow-lg top-[-0.5rem]"
                          >{{ u.firstName }} {{ u.lastName }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-900 font-medium">
                    <span class="border-x px-3">{{ t.data.brand }}</span>
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
            <div class="flex pb-1 pt-1 text-gray-400">
              Task date: {{ date(taskduedate) }}
            </div>
            <div
              class="flex pb-1 py-1"
              v-if="this.$store.state.profileRole <= 2 || notteam || isnot"
            >
              <button
                class="rounded-blk mt-3"
                @click.prevent="reeval(t.data.taskid)"
              >
                Re-evalute
              </button>
            </div>
          </template>
          <template #ccontent>
            <!-- menu -->
            <Menu
              v-if="amendstaskidlen > 0"
              as="div"
              class="relative inline-block flex justify-end"
            >
              <MenuButton class="focus:outline-none">
                <span class="icon flex items-center text-sm font-medium"
                  >Amends
                  <!-- <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg> -->
                  <IconLayout
                    :svgclass="`w-5 h-5`"
                    :svgd="`M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z`"
                  />
                </span>
              </MenuButton>
              <MenuItems
                class="absolute right-0 top-[1rem] z-20 mt-2 origin-top-right rounded-md bg-white border shadow-lg focus:outline-none"
              >
                <div class="py-1">
                  <MenuItem
                    v-slot="{ active }"
                    class="hover:bg-gray-100"
                    v-for="a in amendtasks"
                    :key="a.id"
                  >
                    <a
                      :href="a.permalink"
                      target="_blank"
                      class="flex"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-3 py-3 text-sm flex items-center border-b last:border-b-0',
                      ]"
                    >
                      <span
                        v-for="u in amendtaskuser.filter(
                          (i) => i.id == a.responsibleIds[0]
                        )"
                        :key="u.id"
                        class="pr-1"
                        ><img
                          :src="u.avatarUrl"
                          alt=""
                          class="w-8 h-8 rounded-full"
                      /></span>
                      <span class="flex flex-col"
                        ><span class="elip font-medium pb-[3px]">{{
                          a.title
                        }}</span>
                        <span class="text-xs font-medium"
                          ><span class="italic">{{ date(a.dates.due) }}</span>
                          <template v-for="wf in amendtaskswf" :key="wf.id">
                            <span
                              :class="`w-max ml-3 px-2 py-0.5 rounded-md text-${wf.color}`"
                              :style="`background-color: ${wf.bgcolor}`"
                              >{{ wf.title }}</span
                            >
                          </template></span
                        ></span
                      ></a
                    >
                  </MenuItem>
                </div></MenuItems
              >
            </Menu>
            <div
              class="input z-10 relative mt-3 px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
            >
              <div class="m-auto">
                <!-- grade -->
                <div>
                  <div v-if="t.data.qatype_id != 5">
                    <div class="p-3 mx-8 my-2" v-for="qa in qarr" :key="qa.id">
                      <p class="uppercase font-bold">{{ qa.title }}</p>
                      <div
                        v-for="c in qa.children"
                        :key="c.id"
                        class="flex justify-between items-center px-4 py-1 shadow-sm rounded-md"
                      >
                        <div class="w-[24rem] md:w-[23rem] font-medium">
                          {{ c.title }}
                        </div>
                        <span class="font-medium">
                          <!-- {{
                              Math.round(
                                JSON.parse(t.data.gradearr)
                                  .filter((i) => i.id == qa.id)
                                  .map((c) => c.children)
                                  .flat()
                                  .filter((ch) => ch.id == c.id)
                                  .map((p) => p.per)[0] * 100
                              ) / 100
                            }}% -->
                          {{
                            ans(
                              gradearr(t.data.gradearr, qa.id, c.id)
                            ).toString()
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="p-3 mx-8 my-2" v-for="qa in qarr" :key="qa.id">
                      <p class="uppercase font-bold">{{ qa.title }}</p>
                      <div
                        v-for="c in qa.children"
                        :key="c.id"
                        class="flex justify-between items-center px-4 py-1 shadow-sm rounded-md"
                      >
                        <div class="w-[24rem] md:w-[23rem] font-medium">
                          {{ c.title }}
                        </div>
                        <span class="font-medium">
                          <!-- {{ gradearr(t.data.gradearr, qa.id, c.id) }} -->
                          <StarRating
                            class="m-auto"
                            :grade="gradearr(t.data.gradearr, qa.id, c.id)[0]"
                            :hasCursor="false"
                            :maxstars="5"
                            :starclass="`w-5 h-5`"
                            :hascounter="false"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- grade -->

                <!-- logged -->
                <div class="mt-2 px-5 font-medium">
                  <div>
                    <ul class="pt-3 logged">
                      <li
                        v-for="l in loggedtasks"
                        :key="l.data.taskid"
                        @click.prevent="
                          showlogged(l.data.gradearr, l.data.qatype_id)
                        "
                        class="flex flex-auto justify-between items-center hover:opacity-100 px-5 py-2 cursor-pointer opacity-50 first:pb-[3rem] first:opacity-100 first:pointer-events-none first:border-b"
                      >
                        <p
                          v-for="u in dbusers.filter(
                            (i) => i.userId == l.data.reviewby
                          )"
                          :key="u.userId"
                          class="flex"
                        >
                          <img
                            :src="u.avatar"
                            alt=""
                            class="w-9 h-9 rounded-full"
                          />
                          <span class="flex flex-col self-center pl-2">
                            <p class="font-bold">{{ u.name }}</p>
                            <p>{{ date(l.data.date) }}</p>
                          </span>
                        </p>
                        <p class="flex font-bold">
                          {{ qtitle(l.data.qatype_id) }}: {{ l.data.grade }}%
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- logged -->
              </div>
            </div>
          </template>
        </card-layout>
      </template>
    </div>
  </form-layout>
</template>

<script setup>
import store from "@/store";
import moment from "moment";

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import ModalC from "@/components/ModalC.vue";
import StarRating from "@/components/form/StarRating.vue";

import FormLayout from "@/components/layout/FormLayout.vue";
import CardLayout from "@/components/layout/CardLayout.vue";
import IconLayout from "@/components/layout/IconLayout.vue";

const route = useRoute();
const router = useRouter();
const taskid = route.params.taskId;

const tasks = ref([]);
const loggedtasks = ref([]);
const responsible = ref([]);
const dbusers = ref([]);
const reviewer = ref([]);
const workoverflow = ref([]);
const qatitle = ref("");
const taskduedate = ref("");
const qarr = ref([]);
const modalActive = ref(null);
const loggedtaskarr = ref("");
const loggedtaskqaid = ref("");
const amendtasks = ref([]);
const amendtaskswf = ref([]);
const amendtaskuser = ref([]);
const amendstaskidlen = ref(0);
const isnot = ref(null);
const isnotmsg = ref("");
const defchoices = [
  { id: 0, title: "Yes" },
  { id: 1, title: "No" },
  { id: 2, title: "N/A" },
];

const closeModal = () => {
  modalActive.value = !modalActive.value;
};

const date = (d) => {
  return moment(d).format("MMM Do 'YY");
};

const showlogged = (arr, id) => {
  modalActive.value = !modalActive.value;
  loggedtaskarr.value = arr;
  loggedtaskqaid.value = id;
};

const ans = (id) => {
  return defchoices.filter((i) => i.id == id).map((t) => t.title);
};

const qtitle = (id) => {
  return store.state.jsonqadesmg.parent
    .filter((i) => i.id == id)
    .map((t) => t.title)[0];
};

const reeval = (id) => {
  router.push({ name: "taskreview", params: { taskId: id } });
};

const gradearr = (arr, pid, chid) => {
  return JSON.parse(arr)
    .filter((i) => i.id == pid)
    .map((c) => c.children)
    .flat()
    .filter((ch) => ch.id == chid)
    .map((p) => p.val);
};

onMounted(async () => {
  await store.dispatch("getDBReviewedTasks");
  await store.dispatch("getDBLoggedTasks");
  await store.dispatch("getDBUsers");
  await store.dispatch("getDBAmendTasks");

  tasks.value = computed(() =>
    store.state.DBReviewedTasks.filter((d) => d.data.taskid === taskid)
  ).value;

  const userid = tasks.value.map((d) => d.data.responsibleId);
  await store.dispatch("getWrikeUserData", userid);
  await store.dispatch("getWrikeTaskData", taskid);

  const amendstaskid = store.state.DBAmendTask.filter(
    (d) => d.data.parenttaskid == taskid
  )
    .map((i) => i.data.taskid)
    .flat();
  amendstaskidlen.value = amendstaskid.length;

  if (amendstaskidlen.value > 0) {
    Promise.resolve(store.dispatch("getWrikeTaskData", amendstaskid)).then(
      (r) => {
        const task = r.data.data;
        amendtasks.value = task;
        amendtaskswf.value = store.state.jsontaskworkflow.filter(
          (i) => i.id === task.map((s) => s.customStatusId)[0]
        );
        const userid = task.map((i) => i.responsibleIds[0]);
        store.dispatch("getWrikeUserData", userid).then((r) => {
          amendtaskuser.value = r.data.data;
        });
      }
    );
  }

  const qatype = tasks.value.map((d) => d.data.qatype_id);
  qatitle.value = computed(() =>
    store.state.jsonqadesmg.parent
      .filter((i) => i.id == qatype)
      .map((t) => t.title)
      .flat()
  ).value.toString();
  console.log(qatitle.value);

  qarr.value = computed(() => {
    const def = store.state.jsonqadesmg.parent.filter((i) => i.default == 1);
    const sel = store.state.jsonqadesmg.parent.filter((i) => i.id == qatype);

    return qatype != 5
      ? def.concat(sel)
      : store.state.jsonqadesmg.parent
          .filter((i) => i.id == 5)
          .map((c) => c.children)[0];
  }).value;

  responsible.value = store.state.wrikeUser.data;

  const evalid = tasks.value.map((d) => d.data.reviewby);
  store.dispatch("getWrikeUserData", evalid).then((r) => {
    reviewer.value = r.data.data;
  });

  // Promise.resolve(store.dispatch("getWrikeTaskData", taskid)).then((r) => {
  //   const task = r.data.data;
  //   // taskduedate.value = task.map((d) => d.dates.due)[0];
  //   // workoverflow.value = store.state.jsontaskworkflow.filter(
  //   //   (i) => i.id === task.map((s) => s.customStatusId)[0]
  //   // );
  // });
  console.log(store.state.wrikeTask.data);
  taskduedate.value = store.state.wrikeTask.data.map((d) => d.dates.due)[0];
  workoverflow.value = store.state.jsontaskworkflow.filter(
    (i) => i.id === store.state.wrikeTask.data.map((s) => s.customStatusId)[0]
  );

  loggedtasks.value = computed(() =>
    store.state.DBLoggedTask.filter((d) => d.data.taskid === taskid)
  ).value.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

  dbusers.value = computed(() => store.state.DBUsers.map((d) => d.data)).value;

  if (tasks.value.filter((i) => i.data.taskid == taskid).length == 0) {
    isnot.value = true;
    isnotmsg.value = "This task has not been reviewed.";
  } else if (
    store.state.profileRole >= 4 &&
    tasks.value.map((i) => i.data.responsibleId) != store.state.profileUserId
  ) {
    isnot.value = true;
    isnotmsg.value = "This task is not yours.";
  } else if (
    store.state.profileRole >= 2 &&
    tasks.value.map((i) => i.data.groupid) != store.state.profileGroupId
  ) {
    isnot.value = true;
    isnotmsg.value = "This task is not part of your group.";
  } else if (
    tasks.value.map((i) => i.data.responsibleId) == store.state.profileUserId ||
    store.state.profileRole < 4
  ) {
    isnot.value = false;
  }

  const notteam = computed(() => {
    return tasks.value.map((i) => i.data.groupid) != store.state.profileGroupId
      ? true
      : false;
  });

  console.log(notteam.value);
});
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

    button.form {
      margin: 0;
      padding: 8px 13px;
      font-size: 12px;
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
li.star {
  pointer-events: none;
}

// .logged:nth-child(2):before {
//   content: "second";
// }
ul.logged:has(> :nth-child(2)):before {
  // outline: 1px solid green;
  content: "Previous";
  font-weight: 600;
  position: absolute;
  bottom: 4.2rem;
}

.elip {
  text-overflow: ellipsis;
  max-width: 19rem;
}
</style>
