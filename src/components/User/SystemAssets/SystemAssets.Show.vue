<template>
  <div class="system-assets-show">
    <div class="system-assets-show__block app__block">
      <h2>Manage {{asset}}</h2>

      <div class="system-assets-show__manager-wrp">
        <ticket-manager :asset-code="asset"/>
      </div>
    </div>
  </div>
</template>

<script>
import TicketManager from './components/TicketManager'

export default {
  components: {
    TicketManager
  },
  props: ['asset']
}
</script>

<style scoped>
.system-assets-show__block.app__block {
  max-width: 64rem;
}
</style>
