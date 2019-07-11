<template>
  <div id="app">
    <transition
      mode="out-in"
      :css="false"
      @beforeEnter="beforeArtworkEnter"
      @enter="onArtworkEnter"
      @leave="onArtworkLeave"
    >
      <Artwork
        v-if="currentArtwork"
        :key="currentArtwork.id"
        :imageUrl="currentArtwork.full"
        @click="onArtworkClicked"
      />
    </transition>
  </div>
</template>

<script>
import { value, onCreated, onBeforeDestroy } from 'vue-function-api';
import anime from 'animejs';
import http from './http';
import Artwork from './components/Artwork.vue';

export default {
  name: 'app',
  components: {
    Artwork,
  },
  setup(props, ctx) {
    // Artworks feching logic
    const latestArtwork = value(null);
    const currentArtwork = value(null);
    const currentOffset = value(0);
    const lastUpdate = value(null);
    const pollInterval = parseInt(process.env.VUE_APP_POLL_INTERVAL, 10);
    const artworkExpireDuration = parseInt(
      process.env.VUE_APP_EXPIRE_ARTWORK_DURATION,
      10,
    );
    const poll = async () => {
      const currentArtworkHasExpired = lastUpdate.value
        && Date.now() - lastUpdate.value >= artworkExpireDuration;
      const fetch = async (offset = 0) => {
        const { data } = await http({
          method: 'GET',
          url: '/artworks/',
          params: {
            limit: 1,
            offset,
          },
        });
        const [artwork] = data.results;
        return artwork;
      };
      let artwork = await fetch();

      if (!latestArtwork.value || artwork.id !== latestArtwork.value.id) {
        latestArtwork.value = artwork;
        currentArtwork.value = artwork;
        currentOffset.value = 0;
        lastUpdate.value = Date.now();
      } else if (currentArtworkHasExpired) {
        currentOffset.value += 1;
        artwork = await fetch(currentOffset.value);
        if (artwork) {
          currentArtwork.value = artwork;
        } else {
          currentOffset.value = 0;
        }
        lastUpdate.value = Date.now();
      }
      window.fetchArtworkTimeout = setTimeout(poll, pollInterval);
    };
    onCreated(poll);
    onBeforeDestroy(() => {
      clearTimeout(window.fetchArtworkTimeout);
    });
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
    // Events handlers
    const onArtworkClicked = () => {
      const { $el } = ctx.root;
      if ($el.requestFullscreen) {
        ctx.root.$el.requestFullscreen();
      } else if ($el.webkitRequestFullscreen) {
        $el.webkitRequestFullscreen();
      }
    };
    return {
      currentArtwork,
      beforeArtworkEnter,
      onArtworkEnter,
      onArtworkLeave,
      onArtworkClicked,
    };
  },
};
</script>

<style lang="scss">
body,
html,
#app {
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
