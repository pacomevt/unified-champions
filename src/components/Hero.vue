<template>
  <section class="c-hero">
    <h1 class="c-hero__title -js-animated-title">
      <div class="c-hero__top"><span class="c-hero__prefix">We are</span> <span>UNIFIED</span></div>
      <span class="c-hero__bottom">CHAMPIONS</span>
    </h1>
  </section>
  </template>
  
  <script>
  import { HeroTHREE } from '@/assets/scripts/classes/HeroTHREE';
  export default {
    name: 'Hero',

    data() {
      return {
        hero: {},
      }
    },
    methods : {
      start() {
        this.hero.start = true;
      }
    },
    mounted() {
      this.hero = new HeroTHREE(document.querySelector('.c-hero'), () => {
        this.$emit('hero-loaded');
      });
    }
  }
    </script>
  
  <style lang="scss">
  @import '../styles/main';

  .c-hero {
    
    width: 100%;
    height: 100vh;
    position: relative;
    & > canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    &__title {
      font-size: 19.6rem;
      font-weight: $light;
      text-transform: uppercase;
      text-align: center;
    }
    &__top {
      position: absolute;
      display: flex;
      align-items: baseline;
      justify-content: center;
      width: 100%;
      top: 50%;
      left: 0%;
      transform: translate(0, -100%);
      z-index: 0;
    }
    &__bottom {
      position: absolute;
      display: flex;
      align-items: baseline;
      justify-content: center;
      width: 100%;
      top: 50%;
      left: 0%;
      z-index: 2;
    }
    &__prefix {
      font-size: 4rem;
      font-weight: $bold;
    }
  }
  
  
  </style>