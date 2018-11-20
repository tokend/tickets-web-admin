<template>
  <div class="token-requests-show__row">
    <span class="token-requests-show__key">
          {{ label }}
    </span>
    <span class="token-requests-show__value">
          {{ value }}
    </span>
  </div>
</template>

<script>
  export default {
    props: ['label', 'value']
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../assets/scss/colors";

  .token-requests-show__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .token-requests-show__key {
    &--informative {
      color: $color-info;

      &:before {
        content: "\2713";
      }
    }
  }

  .token-requests-show__value {
    max-width: 24rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
