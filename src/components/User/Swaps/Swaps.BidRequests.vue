<template>
  <div class="bid-requests">
      <h2>Bid requests</h2>

      <div class="bid-requests__filters-wrp">
        <div class="app-list-filters">
          <select-field class="app-list-filters__field" v-model="filters.state" label="State">
            <option v-for="(value, state) in REQUEST_STATES" :key="state" :value="value">{{ state }}</option>
          </select-field>

          <input-field class="app-list-filters__field"
                       label="Requestor"
                       placeholder="Requestor (account id)"
                       v-model.trim="filters.requestor"
          />
        </div>
      </div>

      <div class="bid-requests__list-wrp">
        <template v-if="list && list.data && list.data.length">
          <ul class="app-list">
            <div class="app-list__header">
              <span class="app-list__cell">Ticket code</span>
              <span class="app-list__cell">Request state</span>
              <span class="app-list__cell">Amount</span>
              <span class="app-list__cell">Created At</span>
              <span class="app-list__cell">Requestor</span>
            </div>

            <router-link v-for="item in list.data" class="app-list__li"
                         :key="item.id"
                         :to="{
                            name: 'swaps.request-manager',
                            params: { id: item.id }
                          }"
            >
              <span class="app-list__cell app-list__cell--important" :title="item.code">
                <asset-getter :balance-id="item.atomicSwapBidCreation.baseBalance"/>
              </span>
              <span class="app-list__cell" :title="item.requestState">{{item.requestState}}</span>
              <span class="app-list__cell" :title="item.atomicSwapBidCreation.baseAmount">
                {{item.atomicSwapBidCreation.baseAmount}}
              </span>
              <span class="app-list__cell" :title="item.updatedAt">{{ formatDate(item.createdAt) }}</span>
              <span class="app-list__cell"><email-getter :address="item.requestor" is-titled/></span>
            </router-link>
          </ul>

          <div class="app__more-btn-wrp" v-if="!isLoaded">
            <button class="app__btn-secondary" @click="onMoreClick">More</button>
          </div>
        </template>

        <template v-else>
          <ul class="app-list">
            <li class="app-list__li-like">
              <template v-if="!isLoading">Nothing here yet</template>
              <template v-else>Loading...</template>
            </li>
          </ul>
        </template>
      </div>
  </div>
</template>

<script>
  import { REQUEST_STATES } from '@/constants'
  import {
    EmailGetter,
    AssetGetter
  } from '@comcom/getters'
  import {
    InputField,
    SelectField
  } from '@comcom/fields'

  import { formatDate } from '../../../utils/formatters'
  import api from '@/api'
  import _throttle from 'lodash/throttle'

  export default {
    components: {
      EmailGetter,
      AssetGetter,
      InputField,
      SelectField
    },
    data: _ => ({
      isLoading: false,
      isLoaded: false,
      list: {},
      filters: {
        state: REQUEST_STATES.pending,
        requestor: ''
      },
      REQUEST_STATES
    }),
    created () {
      this.getList()
    },
    methods: {
      formatDate,
      async getList () {
        this.isLoading = true
        try {
          this.list = await
          api.swaps.getBidRequests(this.filters)
          this.isLoaded = !(this.list.data || []).length
        } catch (error) {
          console.error(error)
          error.showMessage('Cannot load request list')
        }
        this.isLoading = false
      },
      async onMoreClick () {
        const oldLength = this.list.data.length
        try {
          this.list = await this.list.concatNext()
          this.isLoaded = oldLength === this.list.data.length
        } catch (error) {
          console.error(error)
          error.showMessage('Cannot load next page')
        }
      }
    },
    watch: {
      'filters.state' () { this.getList() },
      'filters.requestor': _throttle(function () { this.getList() }, 1000)
    }
  }
</script>

<style lang="scss" scoped>
  .bid-requests__filters-wrp {
    margin-bottom: 5rem;
  }
</style>
