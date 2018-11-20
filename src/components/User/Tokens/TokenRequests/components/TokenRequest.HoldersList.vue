<template>
  <div class="import-list">
    <template v-if="state === STATES.loadingBtn">
      <button class="app__btn-secondary" @click="getUserInfo">Get list of ticket holders</button>
    </template>
    <template v-if="state === STATES.loading">
      <span class="import-list__user-info">Loading...</span>
    </template>
    <template v-if="state === STATES.loaded">
      <select-field class="app-list-filters__field import-list__info"
                    label="Information display" v-model="infoToShow">
        <option :value="INFORMATION_DISPLAY_KEY.all">All</option>
        <option :value="INFORMATION_DISPLAY_KEY.firstLastName">First and last name</option>
        <option :value="INFORMATION_DISPLAY_KEY.email">Email</option>
      </select-field>
      <div>Number of ticket holders: {{ holders.length }}</div>
      <div class="import-list__info">
        <div class="import-list__info-row import-list__header">
          <template
            v-if="INFORMATION_DISPLAY_KEY.all === infoToShow || infoToShow === INFORMATION_DISPLAY_KEY.firstLastName">
             <div class="import-list__user-info">Name</div>
          </template>
          <template
            v-if="INFORMATION_DISPLAY_KEY.all === infoToShow || infoToShow === INFORMATION_DISPLAY_KEY.email">
            <div class="import-list__user-info">Email</div>
          </template>
        </div>
        <div class="import-list__info-row" v-for="userInfo in holders" :key="userInfo.accountId">
          <template
            v-if="INFORMATION_DISPLAY_KEY.all === infoToShow || infoToShow === INFORMATION_DISPLAY_KEY.firstLastName">
            <div class="import-list__user-info">{{ userInfo.kyc.firstName }} {{ userInfo.kyc.lastName }}</div>
          </template>
          <template
            v-if="INFORMATION_DISPLAY_KEY.all === infoToShow || infoToShow === INFORMATION_DISPLAY_KEY.email">
            <div class="import-list__user-info"><email-getter :address="userInfo.accountId"/></div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import { Sdk } from '@/sdk'
  import { fromKycTemplate } from '@/utils/kyc-tempater'
  import deepCamelCase from 'camelcase-keys-deep'
  import SelectField from '@comcom/fields/SelectField'
  import { EmailGetter } from '@comcom/getters'
  import config from '@/config'

  const STATES = {
    loading: 'loading',
    loadingBtn: 'loadingBtn',
    loaded: 'loaded'
  }
  const INFORMATION_DISPLAY_KEY = {
    all: '3',
    firstLastName: '1',
    email: '2'
  }
  export default {
    components: {
      SelectField,
      EmailGetter
    },
    props: {
      tokenRequest: {
        type: Object, require: true
      }
    },
    data () {
      return {
        INFORMATION_DISPLAY_KEY,
        STATES,
        holders: [],
        state: STATES.loadingBtn,
        infoToShow: INFORMATION_DISPLAY_KEY.all
      }
    },
    methods: {
      async getUserInfo () {
        this.state = STATES.loading
        this.holders = await this.getBalances()
        this.holders = await this.getUpdateKycRequests(this.holders)
        this.holders = await this.getUsersKysData(this.holders)
        this.state = STATES.loaded
      },
      async getBalances () {
        try {
          const response = await Sdk.horizon.assets.getHolders(this.tokenRequest.operationDetails.code)
          return response.data.filter(holder => +holder.balance > 0)
        } catch (error) {
          console.error(error)
          error.showMessage('Cannot load request list')
        }
      },
      async getUpdateKycRequests (holders) {
        try {
          const promises = holders
            .filter(userInfo => config.MASTER_ACCOUNT !== userInfo.accountId)
            .map(userInfo => {
              return Sdk.horizon.account.getAccountKyc(userInfo.accountId)
                .then(response => {
                  return {
                    ...userInfo,
                    blobId: response.data.kycData.blobId
                  }
                })
            })
          return await Promise.all(promises)
        } catch (error) {
          console.error(error)
          error.showMessage('Cannot load Kyc Requests')
        }
      },
      async getUsersKysData (holders) {
        const promises = []
        try {
          holders.forEach(userInfo => {
            promises.push(Sdk.api.blobs.get(userInfo.blobId).then(response => {
              userInfo.kyc = deepCamelCase(fromKycTemplate(JSON.parse(response.data.value), response.data.id))
              return userInfo
            }))
          })
          return await Promise.all(promises)
        } catch (error) {
          console.error(error)
          error.showMessage('Cannot load Kyc Data')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .import-list__info {
    margin-top: 20px;
  }

  .import-list__header{
    color: #494949;
    margin-bottom: 5px;
  }
  .import-list__info-row {
    display: flex;
  }
  .import-list__user-info{
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.5rem;
    padding-right: 5px;
    text-align: left;
  }
</style>
