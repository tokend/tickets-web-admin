<template>
  <span v-if="asset">{{ asset }}</span>
</template>

<script>
  import api from '@/api'

  export default {
    data: _ => ({
      asset: ''
    }),
    props: ['balanceId'],
    created () {
      this.getAsset()
    },
    methods: {
      async getAsset () {
        const response = await api.assets.getByBalanceId(this.balanceId)
        this.asset = response.data.code
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
