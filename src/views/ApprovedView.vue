<template>
  <tilesfilter-layout
    :loading="loading"
    :bruser="true"
    :contentclass="`flex-wrap items-center py-5`"
  >
    <template #headertitle>
      <span class="pr-4 border-r">{{ date }}</span>
      <span class="text-teal-700 pl-4">Approved</span>
    </template>
    <template #dlbtn>
      <div
        class="group relative bg-grey shadow-md font-medium text-l px-4 py-2.5 rounded-md mx-1 cursor-pointer hover:text-white hover:bg-purple-900 transition duration-150 ease-in-out"
        v-if="displayedarr.length != 0 && isAuthorized"
      >
        <span @click.prevent="exportfile(displayedarr)"
          ><IconLayout
            :svgclass="`w-5 h-5`"
            :svgd="`M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5`"
        /></span>
        <span
          class="absolute bottom-[0.25rem] left-[4rem] w-max hidden group-hover:flex p-2 text-xs text-white whitespace-no-wrap rounded-md bg-black shadow-md"
          >Export to excel</span
        >
      </div>
    </template>
    <template #headerright>
      <div v-if="showcalendar">
        <CalendarC
          @check="getdate"
          class="px-2"
          :qdate="this.$route.query.date"
        />
      </div>
      <div v-else-if="monthlist">
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
    <template #headerbruser>
      <ComboBox
        :options="brands.sort((a, b) => a.title.localeCompare(b.title))"
        :placeholder="`Brands`"
        :zindex="showcalendar == true ? '' : 'z-20'"
        @selectedtitle="fetchBr"
        class="w-[250px]"
      />
      <ComboBoxUsers
        v-if="isAuthorized"
        :options="
          members
            .concat({ id: 0, firstName: 'All', lastName: '' })
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
        "
        :placeholder="`Members`"
        :zindex="showcalendar == true ? '' : 'z-20'"
        @selected="selectedUser"
        class="selectuser mx-1"
      />
    </template>
    <template #content>
      <div
        v-for="task in displayedarr"
        :key="task.taskid"
        class="flex items-center w-max bg-white border border-gray-200 rounded-lg shadow-lg p-5 m-3"
      >
        <tiles-content
          :arr="members.filter((i) => i.id == task.responsibleId)"
          :title="task.tasktitle"
          :brand="task.brand"
          :grade="task.grade"
        />
        <menu-layout
          :href="task.tasklink"
          :atitle="`Go to Wrike`"
          :to="{
            name: 'viewtaskreview',
            params: { taskId: task.taskid },
          }"
          :rltitle="`See Review`"
        />
      </div>
      {{ notask }}
    </template>
  </tilesfilter-layout>
</template>

<script setup>
import moment from "moment";
import store from "@/store";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import get from "@/functions/get";

import exportFromJSON from "export-from-json";

// import ModalC from "@/components/ModalC.vue";
import CalendarC from "@/components/CalendarC.vue";
import ComboBox from "@/components/form/ComboBox.vue";
import ComboBoxUsers from "@/components/form/ComboBoxUsers.vue";
import ListWithId from "@/components/form/ListWithId.vue";
import MenuLayout from "@/components/layout/MenuLayout.vue";
import TilesContent from "@/components/layout/TilesContent.vue";
import IconLayout from "@/components/layout/IconLayout.vue";
import TilesfilterLayout from "@/components/layout/TilesfilterLayout.vue";

// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

// const perpage = ref(100);
// const page = ref(1);
// const modalActive = ref(null);
const route = useRoute();
const loading = ref(false);

const members = ref([]);
const selectedusr = ref();
const selectedbr = ref();

const querypick = route.query.pick;
const querydate = route.query.date;
const qdate = ref("");
const sortdate = ref(moment().format("YYYY-MM-DD"));
const date = ref(moment(new Date()).format("MMMM Do YYYY"));
const pick = [{ name: "Daily" }, { name: "This week" }, { name: "Monthly" }];
const picked = ref("Daily");
const showcalendar = ref(true);
const monthlist = ref(true);
const thisweek = ref(true);
const thisweekrange = ref(get.thisweek.value);
const month = ref(get.month.value);
const monthid = ref(0);
const url = window.location.href;

const gettasks = get.approvedtasks;

onMounted(async () => {
  await store.dispatch("getDBReviewedTasks");
  await store.dispatch("getWrikeGroupData", store.state.profileGroupId);
  await store.dispatch("getDBUsers");

  const membersid = store.state.wrikeGroup.data.map((m) => m.memberIds).flat();

  await store.dispatch("getWrikeUserData", membersid);
  // members.value = store.state.wrikeUser.data;
  members.value = get.userfilter(store.state.wrikeUser.data);

  if (picked.value != "Daily") {
    qdate.value = JSON.parse(querydate);
    date.value = moment(qdate.value.start).subtract("month").format("MMMM 'YY");
    monthid.value = month.value
      .filter((d) => d.start == qdate.value.start && d.end == qdate.value.end)
      .map((i) => i.id)[0];
  } else {
    qdate.value = querydate;
    date.value = moment(qdate.value).format("MMMM Do YYYY");
  }
  changequery(querydate);
});

const changequery = (quedate) => {
  if (url.includes("?")) {
    if (picked.value != "Daily") {
      qdate.value = JSON.parse(quedate);
    } else {
      qdate.value = quedate;
    }
    window.history.replaceState(
      null,
      null,
      `?pick=${picked.value}&date=${quedate}`
    );
  }
};

const getdate = (val) => {
  sortdate.value = moment(val).format("YYYY-MM-DD");
  qdate.value = moment(val).format("YYYY-MM-DD");
  date.value = moment(val).format("MMMM Do YYYY");
  changequery(qdate.value);
};

const selectedmonth = (id) => {
  monthid.value = id;
  date.value = moment(
    month.value.filter((i) => i.id == id).map((s) => s.start)[0]
  )
    .subtract("month")
    .format("MMMM 'YY");
  qdate.value = JSON.stringify({
    start: `${month.value.filter((i) => i.id == id).map((s) => s.start)[0]}`,
    end: `${month.value.filter((i) => i.id == id).map((s) => s.end)[0]}`,
  });
  changequery(qdate.value);
};

const changepick = (val) => {
  if (picked.value == "This week" || val == "This week") {
    showcalendar.value = false;
    monthlist.value = false;
    thisweek.value = true;
    date.value =
      moment().startOf("week").format("MMM Do") +
      " - " +
      moment().endOf("week").format("MMM Do 'YY");
    qdate.value = JSON.stringify({
      start: `${thisweekrange.value.map((s) => s.start)[0]}`,
      end: `${thisweekrange.value.map((s) => s.end)[0]}`,
    });
    changequery(qdate.value);
  } else if (picked.value == "Monthly" || val == "Monthly") {
    showcalendar.value = false;
    monthlist.value = true;
    thisweek.value = false;
    date.value = moment(
      month.value.filter((i) => i.id == monthid.value).map((s) => s.start)[0]
    )
      .subtract("month")
      .format("MMMM 'YY");
    qdate.value = JSON.stringify({
      start: `${
        month.value.filter((i) => i.id == monthid.value).map((s) => s.start)[0]
      }`,
      end: `${
        month.value.filter((i) => i.id == monthid.value).map((s) => s.end)[0]
      }`,
    });
    changequery(qdate.value);
  } else if (picked.value == "Daily" || val == "Daily") {
    showcalendar.value = true;
    monthlist.value = false;
    thisweek.value = false;
    date.value = moment().format("MMMM Do YYYY");
    qdate.value = moment().format("YYYY-MM-DD");
    changequery(qdate.value);
  }
};

const isAuthorized = computed(() => {
  return store.state.profileRole <= 3;
});

const br = store.state.profileBrands.flat().concat(["All", "Others"]);
const allbrands = store.state.jsonBr
  .map((t) => t.title)
  .flat()
  .concat(["All", "Others"]);
const brands = computed(() => {
  const brarr = [];
  if (store.state.profileBrands.flat().length != 0) {
    for (let i = 0; i < br.length; i++) {
      const obj = {
        id: i,
        title: br[i],
      };
      brarr.push(obj);
    }
  } else {
    for (let i = 0; i < allbrands.length; i++) {
      const obj = {
        id: i,
        title: allbrands[i],
      };
      brarr.push(obj);
    }
  }
  return brarr;
});
console.log(monthid.value);

if (url.includes("?")) {
  picked.value = querypick;
  if (picked.value != "Daily") {
    qdate.value = querydate;
  } else {
    qdate.value = querydate;
  }
  changepick(picked.value);
} else {
  console.log("No Parameters in URL");
}

const initarr = computed(() => {
  const arr = ref([]);
  arr.value = gettasks.value;
  if (url.includes("?")) {
    if (picked.value == "Daily") {
      return arr.value
        .flat()
        .filter(
          (d) => new Date(d.data.date).toISOString().slice(0, 10) == qdate.value
        );
    } else {
      return arr.value
        .flat()
        .filter(
          (d) =>
            new Date(d.data.date).toISOString().slice(0, 10) >=
              qdate.value.start &&
            new Date(d.data.date).toISOString().slice(0, 10) <= qdate.value.end
        );
    }
  } else {
    return showcalendar.value == true
      ? date.value === moment(new Date()).format("MMMM Do YYYY")
        ? arr.value
            .flat()
            .filter(
              (d) =>
                new Date(d.data.date).toISOString().slice(0, 10) ==
                new Date().toISOString().slice(0, 10)
            )
        : arr.value
            .flat()
            .filter(
              (d) =>
                new Date(d.data.date).toISOString().slice(0, 10) ==
                sortdate.value
            )
      : thisweek.value == true
      ? arr.value
          .flat()
          .filter(
            (d) =>
              new Date(d.data.date).toISOString().slice(0, 10) >=
                thisweekrange.value.map((s) => s.start)[0] &&
              new Date(d.data.date).toISOString().slice(0, 10) <=
                thisweekrange.value.map((s) => s.end)[0]
          )
      : arr.value
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
  }
});

const fetchBr = (val) => {
  selectedbr.value = val;
};

const selectedUser = (id) => {
  selectedusr.value = id;
};

const filteredbybr = computed(() => {
  return selectedbr.value == "" ||
    selectedbr.value == undefined ||
    selectedbr.value == null ||
    selectedbr.value == "All"
    ? initarr.value.map((d) => d.data)
    : selectedbr.value == "Others"
    ? initarr.value
        .map((d) => d.data)
        .filter((b) => !store.state.profileBrands.flat().includes(b.brand))
    : initarr.value
        .map((d) => d.data)
        .filter((b) => b.brand == selectedbr.value);
});

const displayedarr = computed(() => {
  return selectedusr.value === 0 || selectedusr.value == undefined
    ? filteredbybr.value
    : filteredbybr.value.filter((b) => b.responsibleId == selectedusr.value);
});

const notask = computed(() => {
  return initarr.value.length == 0 ||
    filteredbybr.value.length == 0 ||
    displayedarr.value.length == 0
    ? "No task."
    : "";
});

const exportfile = (arr) => {
  const r = [];
  const u = [];
  for (let x = 0; x < arr.map((i) => i.responsibleId).length; x++) {
    u.push(
      members.value.filter((i) => i.id == arr.map((i) => i.responsibleId)[x])
    );
  }
  for (let i = 0; i < arr.length; i++) {
    const obj = {
      Date: moment(arr[i].date).format("LL"),
      Name: u.flat()[i].firstName + " " + u.flat()[i].lastName,
      Task_Title: arr[i].tasktitle,
      Brand: arr[i].brand,
      Grade: arr[i].grade,
      Task_Due_Date: moment(arr[i].taskdue).format("LL"),
    };
    r.push(obj);
  }

  const data = r;
  const fileName = `Approved_${date.value.replace(/ /g, "_")}`;
  const exportType = exportFromJSON.types.csv;

  if (data) exportFromJSON({ data, fileName, exportType });
};

// pagination
// const paginate = (arr) => {
//   let p = page.value;
//   let ppg = perpage.value;
//   // eslint-disable-next-line prettier/prettier
//       let from = (p * ppg) - ppg;
//   // eslint-disable-next-line prettier/prettier
//       let to = (p * ppg);
//   return arr.slice(from, to);
// };

// const pages = computed(() => {
//   console.log(displayedarr.value.length);
//   let pages = [];
//   let numofpages = Math.ceil(displayedarr.value.length / perpage.value);
//   for (let i = 1; i <= numofpages; i++) {
//     pages.push(i);
//   }
//   return pages;
// });

// const openmodal = () => {
//   modalActive.value = !modalActive.value;
// };
// const closeModal = () => {
//   modalActive.value = !modalActive.value;
// };
// end of pagination
</script>

<style lang="scss" scoped>
.selectuser {
  width: 17rem;
}
</style>
