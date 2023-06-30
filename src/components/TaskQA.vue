<template>
  <div>
    <!-- {{ qadesmgarr }} -->
    <div class="m-auto">
      <!-- {{ selectedid }} -->
      <div class="" v-if="selectedid && selectedid != 5">
        <div class="p-3 mx-8 my-2" v-for="qa in qadesmgarr" :key="qa.id">
          <p class="uppercase font-bold">{{ qa.title }}</p>
          <div
            class="flex justify-between items-center px-4 shadow-sm rounded-md"
            v-for="c in qa.children"
            :key="c.id"
          >
            <div class="w-[24rem] md:w-[12rem] font-medium">{{ c.title }}</div>
            <div>
              <YesNo
                v-if="selectedid == 3"
                :options="defchoices"
                :id="c.val"
                @checked="checkeddef($event, qa.id, c.id)"
              />
              <YesNo
                v-if="selectedid == 4"
                :options="defchoices"
                :id="c.val"
                @checked="checkeddef($event, qa.id, c.id)"
              />
            </div>
          </div>
        </div>
        <div
          class="mx-8 px-3 py-5 flex justify-end items-center font-medium gap-4"
        >
          <div>Grade: {{ Math.round(total) }}</div>
          <div>
            <button @click.prevent="savegrade(arr)" class="rounded-blk">
              Save
            </button>
          </div>
        </div>
      </div>
      <div class="m-auto" v-if="selectedid == 5">
        <div class="">
          <template v-for="qa in qadesmgarr" :key="qa.id">
            <div class="p-3 mx-8 my-2" v-for="c in qa.children" :key="c.id">
              <p class="uppercase font-bold">{{ c.title }}</p>
              <div
                class="flex justify-between items-center px-4 py-3 shadow-sm rounded-md"
                v-for="ch in c.children"
                :key="ch.id"
              >
                <div class="w-[24rem] font-medium">{{ ch.title }}</div>
                <div class="flex">
                  <StarRating
                    class="m-auto"
                    :grade="ch.val"
                    :maxstars="maxstars"
                    :hascounter="false"
                    :hasCursor="true"
                    :starclass="`w-6 h-6`"
                    @rate="checkrate($event, c.id, ch.id)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
        <div
          class="mx-8 px-3 py-5 flex justify-end items-center font-medium gap-4"
        >
          <div class="fount-medium">Grade: {{ Math.round(rating) }}</div>
          <div>
            <!-- <button
              @click.prevent="saverating(arr)"
              :class="rating >= 70 ? '' : 'pointer-events-none opacity-60'"
              class="form"
            >
              Save
            </button> -->
            <button
              @click.prevent="saverating(arr)"
              :class="
                arr
                  .map((c) =>
                    c.children.map((o) => o.children.map((o) => o.val))
                  )
                  .flat()
                  .flat()
                  .every((i) => i >= 1)
                  ? ''
                  : 'pointer-events-none opacity-60'
              "
              class="rounded-blk"
            >
              {{ !loading ? "Save" : "Saving..." }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, defineEmits, defineProps } from "vue";
import moment from "moment";
import store from "@/store";
import db from "@/firebase/init";
// import { useRoute } from "vue-router";
// import { useRouter } from "vue-router";

// import RadioGroup from "./form/RadioGroup.vue";
import StarRating from "./form/StarRating.vue";
import YesNo from "./form/YesNo.vue";

const props = defineProps({
  taskid: { type: String },
  tasktitle: { type: String },
  tasklink: { type: String },
  taskdue: { type: String },
  tasknumber: { type: String },
  responsibleId: { type: String },
  brand: { type: String },
  selectedid: { type: Number },
  selectedarr: { type: Object },
  qadesmgarr: { type: Object },
});
// const router = useRouter();
const user_id = store.state.profileUserId;
const user_grpId = store.state.profileGroupId;
// const qadesmg = store.state.jsonqadesmg;
const defchoices = [
  { id: 0, title: "Yes" },
  { id: 1, title: "No" },
  { id: 2, title: "N/A" },
];
const total = ref(0);
const rating = ref(0);
const maxstars = ref(5);
// const grade = ref(0);
const arr = computed(() => props.qadesmgarr);
const ynarr = ref([]);
const toast = ref(null);
const loading = ref(false);
watch(
  () => arr.value,
  (newval) => {
    newval.map((c) => c.children.map((o) => (o.val = 0)));
    total.value = newval
      .map((c) => c.children.filter((i) => i.val == 0))
      .flat()
      .reduce((a, o) => a + o.per, 0);
  }
);

onMounted(async () => {
  await store.dispatch("getDBReviewedTasks");
});

//initial total
const initarr = arr.value.map((c) => c.children).flat();
total.value = initarr.reduce((a, o) => a + o.per, 0);

// yes-no-na
function checkeddef(val, pid, chid) {
  arr.value
    .filter((i) => i.id == pid)
    .map((c) => c.children.filter((i) => i.id == chid && (i.val = val)));

  //yes
  const yestotal = initarr
    .filter((i) => i.val == 0 || i.val == 1)
    .reduce((a, o) => a + o.per, 0);
  const n = initarr.filter((i) => i.val === 2).map((o) => o.per);

  //na
  const natotal = ref(0);
  natotal.value = arr.value
    .filter((c) => c.children.every((i) => i.val === 2))
    .map((t) => t.total)
    .reduce((a, o) => a + o, 0);

  //no
  // const no = initarr.filter((i) => i.val == 1).map((i) => i.per);
  const no = arr.value
    .map((c) => c.children.filter((v) => v.val == 1).map((i) => i.per))
    .flat();
  const nototal = [0];
  for (let n = 0; n < no.length; n++) {
    nototal.push((no[n] / (100 - natotal.value)) * 100);
  }

  //total
  total.value =
    // eslint-disable-next-line prettier/prettier
        (yestotal + n.reduce((a, o) => a + o, 0)) - nototal.reduce((a, o) => a + o, 0);
}

// star rating
function checkrate(val, pcid, chid) {
  const ch = props.qadesmgarr.map((c) => c.children)[0];
  const per = ch
    .filter((i) => i.id == pcid)
    .map((c) => c.children.filter((i) => i.id == chid).map((o) => o.per)[0])[0];
  const grd = ((100 - (maxstars.value - val.value) * 7.5) / 100) * per;
  ch.filter((i) => i.id == pcid).map((c) =>
    c.children.filter(
      (i) => i.id == chid && (i.val = val.value) && (i.grade = grd)
    )
  );

  if (val.value == 0) {
    const zeroval = ch
      .filter((i) => i.id == pcid)
      .map((c) =>
        c.children.filter((i) => i.id == chid).map((o) => o.grade)
      )[0];
    rating.value = rating.value - zeroval[0];
    ch.filter((i) => i.id == pcid).map((c) =>
      c.children.filter((i) => i.id == chid && (i.grade = 0))
    );
  } else {
    rating.value = ch
      .map((c) => c.children.filter((i) => i.val != 0).map((g) => g.grade))
      .flat()
      .reduce((a, o) => a + o, 0);
  }
}

const emit = defineEmits(["checked"]);

async function savegrade(arr) {
  loading.value = true;
  console.log(arr);
  console.log(Math.round(total.value * 100) / 100);
  for (let i = 0; i < arr.length; i++) {
    const child = ref([]);
    for (let x = 0; x < arr[i].children.length; x++) {
      const ch = {
        id: arr[i].children[x].id,
        per: arr[i].children[x].per,
        val: arr[i].children[x].val,
      };
      child.value.push(ch);
    }
    ynarr.value.push({
      id: arr[i].id,
      total: arr[i].total,
      children: child.value.flat(),
    });
  }
  if (
    store.state.DBReviewedTasks.map((d) => d.data.taskid).includes(props.taskid)
  ) {
    const taskdbuid = store.state.DBReviewedTasks.filter(
      (d) => d.data.taskid == props.taskid
    ).map((i) => i.id)[0];

    const taskdbreviewby = store.state.DBReviewedTasks.filter(
      (d) => d.data.taskid == props.taskid
    )
      .map((x) => x.data.reviewby)
      .flat();

    if (taskdbreviewby.includes(user_id)) {
      const index = taskdbreviewby.indexOf(user_id);
      taskdbreviewby.splice(index, 1);
    } else {
      taskdbreviewby.push(user_id);
    }

    const uid = ref();
    await db
      .collection("loggedtasks")
      .add({
        taskid: props.taskid,
        reviewby: user_id,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(total.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .then((r) => {
        uid.value = r.id;
      });

    const getdb = db.collection("reviewedtasks").doc(taskdbuid);
    await getdb
      .update({
        recentloggeduid: uid.value,
        taskdue: props.taskdue,
        responsibleId: props.responsibleId,
        reviewby: taskdbreviewby,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(total.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    const uid = ref();
    await db
      .collection("loggedtasks")
      .add({
        taskid: props.taskid,
        reviewby: user_id,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(total.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .then((r) => {
        uid.value = r.id;
      });
    await db
      .collection("reviewedtasks")
      .add({
        recentloggeduid: uid.value,
        taskid: props.taskid,
        tasktitle: props.tasktitle,
        tasklink: props.tasklink,
        taskdue: props.taskdue,
        tasknumber: props.tasknumber,
        responsibleId: props.responsibleId,
        reviewby: [user_id],
        groupid: user_grpId,
        brand: props.brand,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(total.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .finally(() => {
        loading.value = false;
      });
    console.log(ynarr.value);
  }
  // router.push({ name: "approved" });
  toast.value = !toast.value;
  emit("checked", toast.value);
}
async function saverating(arr) {
  loading.value = true;
  const arrch = arr.map((c) => c.children).flat();
  for (let i = 0; i < arrch.length; i++) {
    const child = ref([]);
    for (let x = 0; x < arrch[i].children.length; x++) {
      const ch = {
        id: arrch[i].children[x].id,
        per: arrch[i].children[x].per,
        val: arrch[i].children[x].val,
        grade: arrch[i].children[x].grade,
      };
      child.value.push(ch);
    }
    ynarr.value.push({
      id: arrch[i].id,
      total: arrch[i].total,
      children: child.value.flat(),
    });
  }

  if (
    store.state.DBReviewedTasks.map((d) => d.data.taskid).includes(props.taskid)
  ) {
    const taskdbuid = store.state.DBReviewedTasks.filter(
      (d) => d.data.taskid == props.taskid
    ).map((i) => i.id)[0];

    const taskdbreviewby = store.state.DBReviewedTasks.filter(
      (d) => d.data.taskid == props.taskid
    )
      .map((x) => x.data.reviewby)
      .flat();

    if (taskdbreviewby.includes(user_id)) {
      const index = taskdbreviewby.indexOf(user_id);
      taskdbreviewby.splice(index, 1);
    } else {
      taskdbreviewby.push(user_id);
    }

    const uid = ref();
    await db
      .collection("loggedtasks")
      .add({
        taskid: props.taskid,
        reviewby: user_id,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(rating.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .then((r) => {
        uid.value = r.id;
      });

    const getdb = db.collection("reviewedtasks").doc(taskdbuid);
    await getdb
      .update({
        recentloggeduid: uid.value,
        taskdue: props.taskdue,
        responsibleId: props.responsibleId,
        reviewby: taskdbreviewby,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(rating.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    const uid = ref();
    await db
      .collection("loggedtasks")
      .add({
        taskid: props.taskid,
        reviewby: user_id,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(rating.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .then((r) => {
        uid.value = r.id;
      });
    await db
      .collection("reviewedtasks")
      .add({
        recentloggeduid: uid.value,
        taskid: props.taskid,
        tasktitle: props.tasktitle,
        tasklink: props.tasklink,
        taskdue: props.taskdue,
        tasknumber: props.tasknumber,
        responsibleId: props.responsibleId,
        reviewby: [user_id],
        groupid: user_grpId,
        brand: props.brand,
        gradearr: JSON.stringify(ynarr.value),
        grade: Math.round(rating.value * 100) / 100,
        qatype_id: props.selectedid,
        date: moment(new Date()).format(),
      })
      .finally(() => {
        loading.value = false;
      });
    console.log(ynarr.value);
  }
  // router.push({ name: "approved" });
  toast.value = !toast.value;
  emit("checked", toast.value);
}
</script>

<style lang="scss" scoped></style>
