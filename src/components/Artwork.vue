<template>
  <div class="artwork">
    <div>
      <img :src="imageUrl" v-on="$listeners" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.artwork {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.artwork > div {
  text-align: center;
}
img {
  max-width: 100%;
  max-height: 100vh;
}
</style>
