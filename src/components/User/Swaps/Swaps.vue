<template>
  <div class="swaps">

    <user-header>
      <router-link :to="{ name: 'swaps.bid-requests' }" slot="nav">
        Bid requests
      </router-link>
    </user-header>

    <div class="app__user-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import UserHeader from '@/components/User/components/UserHeader'
  export default {
    components: { UserHeader }
  }
</script>

<style scoped>

</style>
