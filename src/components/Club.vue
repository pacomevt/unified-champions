<template>
  <div class="c-club">
    <div class="c-club__container">
          <h2 class="c-club__title">LE CLUB</h2>
    </div>
  </div>
</template>

<script>
import { ClubTHREE } from '@/assets/scripts/classes/ClubTHREE';
export default {
  name: 'Club',
  data() {
    return {
      clubTHREE: {},
    }
  },
  methods : {
    start() {
      this.clubTHREE.start = true;
    }
  },
  mounted() {
    this.clubTHREE = new ClubTHREE(
      document.querySelector('.c-club__container'),
      document.querySelector('.c-club'),
      () => {
        this.$emit('club-loaded');
      });
  }
}
</script>

<style lang="scss">
@import '../styles/main';
.c-club {
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 500vh;
  position: relative;

  &__container {
    width: 100%;
    height: $screen-height;
    position: sticky;
    top: $offset;
    left: 0;
  }

  & canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  &__title {
    font-size: 14.8rem;
    font-weight: $light;
    text-transform: uppercase;
    text-align: center;
    margin: 0;
    color: white;
    padding-top: 8rem;
  }

}
</style>