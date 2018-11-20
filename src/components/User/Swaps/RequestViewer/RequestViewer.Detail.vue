<template>
  <p class="detail">
    <span class="detail__label">{{ label }}</span>
    <span class="detail__value">{{ value }}</span>
  </p>
</template>

<script>
  export default {
    props: ['label', 'value']
  }
</script>

<style lang="scss" scoped>
  .detail__label {
    display: inline-block;
    $width: 15rem;

    margin-right: 2rem;
    max-width: $width;
    overflow: hidden;
    text-overflow: ellipsis;
    width: $width;
  }
</style>
