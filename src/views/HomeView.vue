<template>
  <div class="l-landing-page">
    <main>
      <Hero  v-on:hero-loaded="handleLoading('hero')" ref="hero"/>
      <Club v-on:club-loaded="handleLoading('club')" ref="club"/>
      </main>
  </div>
  </template>
  
  <script>
import Hero from '@/components/Hero.vue';
import Club from '@/components/Club.vue';

export default {
  name: 'HomeView',
  data() {
    return {
      loader: [],
      loading: true
    }
  },
  components: {
    Hero,
    Club
  },
  methods: {
    handleLoading(component) {
      this.loader[component] = true;
      if (Object.values(this.loader).every(value => value === true)) {
        this.loading = false;
        this.start();
      }
    },
    start() {
        console.log('all files loaded -> ', this.loader);
        this.$refs.club.start();
        this.$refs.hero.start();
    }
  },
  mounted() {
    const components = [
      "hero",
      "club"
    ];
    components.forEach(component => {
      this.loader[component] = false;
    });
  }
}
</script>
  
  <style lang="scss">
  @import '../styles/main';
  $blur-white: rgba(255, 255, 255, 0.1);
  $blur-purple : rgba(164, 33, 240, 0.1);
  $white: #fff;
  
  body {
    display: flex;
    align-items: center;
  }
  .l-landing-page {
    width: calc(100% - 2 * $offset);
    margin: 0 auto;

    min-height: 100vh;
  }
  </style>