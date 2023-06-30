<template>
  <div class="rating">
    <ul class="list flex">
      <li
        @click="rate(star)"
        v-for="star in maxstars"
        :key="star.stars"
        :class="{
          active: star <= stars,
          'pointer-events-none': hasCursor == false,
          'cursor-pointer': hasCursor == true,
        }"
        class="star"
      >
        <!-- :class="star <= stars ? 'fill-blue' : 'fill-grey'" -->
        <svg
          class="block"
          :class="starclass"
          :fill="star <= stars ? 'purple' : 'transparent'"
          :stroke="star <= stars ? 'purple' : 'purple'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      </li>
    </ul>
    <div class="info counter" v-if="hascounter">
      <span class="score-rating">{{ stars }}</span>
      <span class="divider">/</span>
      <span class="score-max">{{ maxstars }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  grade: { type: Number },
  maxstars: { type: Number },
  hascounter: { type: Boolean },
  hasCursor: { type: Boolean },
  starclass: { type: String },
});

const stars = ref(props.grade);

const emit = defineEmits(["rate"]);

function rate(star) {
  if (typeof star === "number" && star <= props.maxstars && star >= 0) {
    stars.value = stars.value === star ? star - 1 : star;
    emit("rate", stars);
  }
}
</script>

<!-- <style scoped>
li.star {
  cursor: pointer;
}
</style> -->
