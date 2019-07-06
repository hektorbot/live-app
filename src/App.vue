<template>
  <div id="app">
    <transition
      mode="out-in"
      :css="false"
      @beforeEnter="beforeArtworkEnter"
      @enter="onArtworkEnter"
      @leave="onArtworkLeave"
    >
      <Artwork v-if="currentArtwork" :key="currentArtwork.id" :imageUrl="currentArtwork.full" />
    </transition>
  </div>
</template>

<script>
import { value, onCreated } from 'vue-function-api';
import anime from 'animejs';
import http from './http';
import Artwork from './components/Artwork.vue';

export default {
  name: 'app',
  components: {
    Artwork,
  },
  setup() {
    // Artworks feching logic
    const currentArtwork = value(null);
    const poll = async () => {
      const { data } = await http({
        method: 'GET',
        url: '/artworks/',
        params: {
          limit: 1,
          offset: 0,
        },
      });
      const [latestArtwork] = data.results;
      if (!currentArtwork || latestArtwork.id !== currentArtwork.id) {
        currentArtwork.value = latestArtwork;
      }
      setTimeout(poll, 3000);
    };
    onCreated(poll);
    // Artwork in/out animations
    const beforeArtworkEnter = (el) => {
      el.style.opacity = 0;
    };
    const onArtworkEnter = async (el, complete) => {
      await new Promise((resolve) => {
        el.querySelector('img').onload = resolve;
      });
      anime({
        targets: el,
        opacity: [0, 1],
        scale: [0, 1],
        duration: 400,
        easing: 'easeInOutQuad',
        complete,
      });
    };
    const onArtworkLeave = async (el, complete) => {
      anime({
        targets: el,
        scale: 0,
        opacity: 0,
        duration: 400,
        easing: 'easeInOutQuad',
        complete,
      });
    };
    return {
      currentArtwork,
      beforeArtworkEnter,
      onArtworkEnter,
      onArtworkLeave,
    };
  },
};
</script>

<style lang="scss">
body,
html,
#app {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
