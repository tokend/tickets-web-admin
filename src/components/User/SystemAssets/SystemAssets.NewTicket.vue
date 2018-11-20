<template>
  <div class="assets-new">
    <div class="app__block assets-new__block">
      <h2>Create ticket</h2>

      <div class="assets-new__manager-wrp">
        <ticket-manager/>
      </div>
    </div>
  </div>
</template>

<script>
import TicketManager from './components/TicketManager'

export default {
  components: {
    TicketManager
  }
}
</script>

<style scoped>
.assets-new__block.app__block {
  max-width: 64rem;
}
</style>
