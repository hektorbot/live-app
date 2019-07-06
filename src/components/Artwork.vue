<template>
  <div>
    <img :src="imageUrl" />
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
img {
  max-width: 100%;
  max-height: 100vh;
}
</style>
