<template>
  <div class="modal absolute left-0 top-0">
    <div v-if="modalMessage" class="modal-content w-[600px] justify-center">
      <p class="text-center">{{ this.modalMessage }}</p>
      <button class="form mt-2" @click="closeModal">Close</button>
    </div>
    <div v-else class="modal-content w-[600px] text-sm">
      <div v-if="loggedtaskqaid != 5">
        <div class="p-3 mx-8 my-2" v-for="qa in qarr" :key="qa.id">
          <p class="uppercase font-bold text-left">{{ qa.title }}</p>
          <div
            v-for="c in qa.children"
            :key="c.id"
            class="flex justify-between items-center px-4 py-1 shadow-sm rounded-md"
          >
            <div class="w-[24rem] md:w-[23rem] font-medium">
              {{ c.title }}
            </div>
            <span class="font-medium">
              {{
                ans(
                  JSON.parse(loggedtaskarr)
                    .filter((i) => i.id == qa.id)
                    .map((c) => c.children)
                    .flat()
                    .filter((ch) => ch.id == c.id)
                    .map((p) => p.val)
                ).toString()
              }}
            </span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="p-3 mx-8 my-2" v-for="qa in qarr" :key="qa.id">
          <p class="uppercase font-bold text-left">{{ qa.title }}</p>
          <div
            v-for="c in qa.children"
            :key="c.id"
            class="flex justify-between items-center px-4 py-1 shadow-sm rounded-md"
          >
            <div class="w-[24rem] md:w-[23rem] font-medium">
              {{ c.title }}
            </div>
            <span class="font-medium">
              <StarRating
                class="m-auto"
                :grade="gradearr(loggedtaskarr, qa.id, c.id)[0]"
                :hasCursor="false"
                :maxstars="5"
                :starclass="`w-5 h-5`"
                :hascounter="false"
              />
              <!-- {{
                ans(
                  JSON.parse(loggedtaskarr)
                    .filter((i) => i.id == qa.id)
                    .map((c) => c.children)
                    .flat()
                    .filter((ch) => ch.id == c.id)
                    .map((p) => p.val)
                ).toString()
              }} -->
            </span>
          </div>
        </div>
      </div>
      <button class="form mt-2" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup>
import store from "@/store";
import { computed, defineProps, defineEmits } from "vue";
import StarRating from "./form/StarRating.vue";

const props = defineProps({
  modalMessage: { type: String },
  loggedtaskarr: { type: String },
  loggedtaskqaid: { type: Number },
  defchoices: { type: Object },
});

const ans = (id) => {
  return props.defchoices.filter((i) => i.id == id).map((t) => t.title);
};

const qarr = computed(() => {
  const def = store.state.jsonqadesmg.parent.filter((i) => i.default == 1);
  const sel = store.state.jsonqadesmg.parent.filter(
    (i) => i.id == props.loggedtaskqaid
  );

  return props.loggedtaskqaid != 5
    ? def.concat(sel)
    : store.state.jsonqadesmg.parent
        .filter((i) => i.id == 5)
        .map((c) => c.children)[0];
});

const gradearr = (arr, pid, chid) => {
  return JSON.parse(arr)
    .filter((i) => i.id == pid)
    .map((c) => c.children)
    .flat()
    .filter((ch) => ch.id == chid)
    .map((v) => v.val);
};

const emit = defineEmits(["close-modal"]);
const closeModal = () => {
  emit("close-modal");
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  // position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);

  .modal-content {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    border-radius: 8px;
    // width: 300px;
    padding: 40px 30px;
    background-color: #fff;

    // p {
    //   text-align: center;
    // }

    button {
      align-self: center;
      background-color: #000;
      color: #f6f6f6;
      text-transform: uppercase;
      padding: 10px 15px;
      border-radius: 50px;
      font-size: 14px;
    }
  }
}
</style>
