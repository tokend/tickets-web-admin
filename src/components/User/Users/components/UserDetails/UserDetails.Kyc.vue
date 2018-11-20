<template>
  <div class="user-details-account">
    <h3 class="user-details-account__title">KYC information</h3>

    <template v-if="isLoaded">
      <ul class="key-value-list">
        <li>
          <span>First name</span>
          <span :title="kyc.firstName">{{kyc.firstName}}</span>
        </li>
        <li>
          <span>Last name</span>
          <span :title="kyc.lastName">{{kyc.lastName}}</span>
        </li>
      </ul>
    </template>

    <template v-else-if="isFailed">
      <p class="danger">An error occurred. Please try again later.</p>
    </template>

    <template v-else>
      <p>Loading...</p>
    </template>
  </div>
</template>

<script>
import { UserDocGetter, UserDocLinkGetter, ImgGetter } from '@comcom/getters'
import { fromKycTemplate } from '../../../../../utils/kyc-tempater'
import deepCamelCase from 'camelcase-keys-deep'
import config from '@/config'
import api from '@/api'

const ID_DOCUMENTS_VERBOSE = {
  passport: 'Passport',
  identity_card: 'Identity card',
  driving_license: 'Driving license',
  residence_permit: 'Residence permit'
}

export default {
  components: {
    UserDocGetter,
    UserDocLinkGetter,
    ImgGetter
  },

  data () {
    return {
      kyc: {},
      isLoaded: false,
      isFailed: false,
      config,
      ID_DOCUMENTS_VERBOSE
    }
  },

  props: ['user', 'blobId'],

  created () {
    this.getKyc()
  },

  methods: {
    async getKyc () {
      this.isLoaded = false
      this.isFailed = false

      try {
        const kycFormResponse = (await api.users
          .blobsOf(this.user.id)
          .get(this.blobId, true)).data
        this.kyc = deepCamelCase(fromKycTemplate(JSON.parse(kycFormResponse.value)))
        this.isLoaded = true
      } catch (error) {
        console.error(error)
        this.isFailed = true
      }
    }
  },
  watch: {
    user () { this.getKyc() },
    blobId () { this.getKyc() }
  }
}
</script>

<style lang="scss" scoped>
  .code-details {
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    padding-left: 2rem;
  }

  .user-details-account__title {
    margin-bottom: 2rem;
  }

  .user-details-account__docs {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem;
  }

  .user-details-account__doc-view-wrp {
    width: 100%;

    &:first-child {
      margin-right: 2rem;
    }
  }

</style>
