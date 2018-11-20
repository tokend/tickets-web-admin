<template>
  <div class="request-manager">
    <h2>Bid request # {{ id }}</h2>
    <template v-if="asset && request">
      <div class="app__block">
        <section class="request-manager__request-viewer-wrp">
          <h3 class="request-manager__heading">Request details</h3>
          <request-viewer :request="request"/>
        </section>

        <section class="request-manager__ticket-viewer-wrp">
          <h3 class="request-manager__heading">Ticket details</h3>
          <ticket-viewer :ticket="asset"/>
        </section>

        <section class="request-manager__reviewer-wrp">
          <h3 class="request-manager__heading">Review request</h3>
          <reviewer :request="request"/>
        </section>

      </div>
    </template>
    <template v-else>
      Loading...
    </template>
  </div>
</template>
<script>
  import api from '@/api'

  import RequestViewer from './RequestViewer/RequestViewer'
  import TicketViewer from './TicketViewer/TicketViewer'
  import Reviewer from './RequestReviewer/RequestReviewer'

  export default {
    props: ['id'],
    components: {
      RequestViewer,
      TicketViewer,
      Reviewer
    },
    data: _ => ({
      request: null,
      asset: null
    }),
    created () {
      this.getRequest()
    },
    methods: {
      async getRequest () {
        const request = await api.requests.get(this.id)
        this.request = {
          ...request,
          ...request.atomicSwapBidCreation,
          ...request.atomicSwapBidCreation.details
        }
        const asset = await api.assets.getByBalanceId(this.request.baseBalance)
        this.asset = (await api.assets.get(asset.data.code)).data
      }
    }
  }
</script>


<style lang="scss" scoped>
  .request-manager__heading {
    margin-bottom: 2rem;
  }

  .request-manager__request-viewer-wrp,
  .request-manager__ticket-viewer-wrp {
    margin-bottom: 5rem;
  }
</style>
