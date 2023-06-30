<template>
  <div
    class="loading flex flex-col text-sm font-medium items-center absolute left-0 right-0"
  >
    <!-- <div class="dot-rolling"></div> -->
    <div
      class="border px-6 py-1 rounded-md bg-gray-100 border-purple-300 shadow-lg"
    >
      Loading...
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loading {
  /**
 * ==============================================
 * Experimental: Emoji
 * Dot Rolling
 * ==============================================
 */
  .dot-rolling {
    position: relative;
    height: 10px;
    font-size: 10px;
  }
  .dot-rolling::before {
    content: "⚽";
    display: inline-block;
    position: relative;
    transform: translateX(-25px);
    animation: dot-rolling 3s infinite;
  }

  @keyframes dot-rolling {
    0% {
      content: "⚽";
      transform: translateX(-25px) rotateZ(0deg);
    }
    16.667% {
      content: "⚽";
      transform: translateX(25px) rotateZ(720deg);
    }
    33.333% {
      content: "⚽";
      transform: translateX(-25px) rotateZ(0deg);
    }
    34.333% {
      content: "🏀";
      transform: translateX(-25px) rotateZ(0deg);
    }
    50% {
      content: "🏀";
      transform: translateX(25px) rotateZ(720deg);
    }
    66.667% {
      content: "🏀";
      transform: translateX(-25px) rotateZ(0deg);
    }
    67.667% {
      content: "🏐";
      transform: translateX(-25px) rotateZ(0deg);
    }
    83.333% {
      content: "🏐";
      transform: translateX(25px) rotateZ(720deg);
    }
    100% {
      content: "🏐";
      transform: translateX(-25px) rotateZ(0deg);
    }
  }
}
</style>
