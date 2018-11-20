<template>
  <div class="request-viewer">

    <div class="request-viewer__details-wrp">
      <detail label="Request state" :value="request.requestState"/>
      <detail label="Requestor" :value="request.requestor"/>
      <detail label="Amount" :value="request.baseAmount"></detail>
      <detail label="Balance" :value="request.baseBalance"></detail>
      <detail label="Created At" :value="formatDate(request.createdAt)"></detail>
    </div>

    <div class="request-viewer__prices">
      <h4 class="request-viewer__prices-heading">Prices</h4>
      <template v-for="q in request.quoteAssets">
        <detail :label="q.asset" :value="q.price"/>
      </template>
    </div>

  </div>
</template>

<script>
  import Detail from './RequestViewer.Detail'

  import { formatDate } from '../../../../utils/formatters'

  export default {
    props: ['request'],
    components: { Detail },
    methods: {
      formatDate
    }
  }
</script>

<style lang="scss" scoped>
  .request-viewer__details-wrp {
    margin-bottom: 2rem;
  }
</style>
