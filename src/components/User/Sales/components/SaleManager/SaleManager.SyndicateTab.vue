<template>
  <div class="sale-manager-syndicate-tab">
    <template v-if="isLoaded">
      <div class="sale-manager-syndicate-tab__details-wrp">
        <label class="data-caption">Corporate user details</label>
        <ul class="key-value-list">
          <li>
            <span>Name</span>
            <span>{{syndicate.name}}</span>
          </li>
          <li>
            <span>Founded</span>
            <date-formatter :date="syndicate.founded" format="DD MMM YYYY" />
          </li>
          <li>
            <span>About</span>
            <span>{{syndicate.about}}</span>
          </li>
          <li>
            <span>Direction</span>
            <span>{{syndicate.direction}}</span>
          </li>
          <li>
            <span>Education</span>
            <span>{{syndicate.education}}</span>
          </li>
          <li>
            <span>Exhibition</span>
            <span>{{syndicate.exhibition}}</span>
          </li>
          <li v-if="syndicate.documents.kyc_contract.key">
            <span>KYC contract</span>
            <span><user-doc-link-getter :user-id="user.id"
                                  :file-key="syndicate.documents.kyc_contract.key"
                                  class="key-value-list__link"
            >Open file</user-doc-link-getter></span>
          </li>
        </ul>
      </div>
    </template>

    <template v-else-if="isFailed">
      <p class="text danger">
        An error occurred. Please try again later.
      </p>
    </template>

    <template v-else>
      <p class="text">
        Loading...
      </p>
    </template>
  </div>
</template>

<script>
import api from '@/api'
import { DateFormatter } from '@comcom/formatters'
import SyndicateMember from '@comcom/SyndicateMember'
import SocialLinks from '@comcom/SocialLinks'
import { BLOB_TYPES } from '../../../../../constants'
import { UserDocLinkGetter } from '@comcom/getters'

import _get from 'lodash/get'

export default {
  components: {
    DateFormatter,
    SyndicateMember,
    SocialLinks,
    UserDocLinkGetter
  },

  props: ['sale', 'saleRequest', 'user', 'blobId'],

  data () {
    return {
      syndicate: {},
      isLoaded: false,
      isFailed: false
    }
  },

  created () {
    this.getSyndicate({
      ownerId: _get(this.sale, 'ownerId') ||
               _get(this.saleRequest, 'requestor') ||
               _get(this.user, 'id'),
      blobId: this.blobId
    })
  },

  methods: {
    async getSyndicate ({ ownerId: owner, blobId }) {
      try {
        const response = blobId
          ? await api.users
            .blobsOf(owner)
            .get(blobId, true)
          : await api.users
            .blobsOf(owner)
            .getAll({ type: BLOB_TYPES.syndicate_kyc }, true)

        this.syndicate = JSON.parse(response.data.value || response.data[0].value)
        console.log('sssss')
        console.log(this.syndicate)
        this.isLoaded = true
      } catch (error) {
        this.isFailed = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sale-manager-syndicate-tab__details-wrp {
  max-width: 48rem;
}

.sale-manager-syndicate-tab__member-wrp {
  & + & {
    margin-top: 6rem;
  }
}

.sale-manager-syndicate-tab__team-h3 {
  margin-left: 20rem;
  margin: 4rem 0 4rem 0rem; // WARN: left - magic number
}

.key-value-list__link{
}
</style>
