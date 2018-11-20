<template>
  <div class="ticket-manager">
    <div class="ticket-manager__current-wrp" v-if="asset.available_for_issuance && asset.issued">
      <div class="ticket-manager__current-issuance-details">
        <span class="available">
          <span class="highlight amount text">{{ asset.available_for_issuance }}&nbsp;•&nbsp;</span>
          <label class="label">available for issuance</label>
        </span>
        <span class="issued">
          <span class="highlight amount text">{{ asset.issued }}&nbsp;•&nbsp;</span>
          <label class="label">issued</label>
        </span>
      </div>
    </div>

    <form @submit.prevent="submit">
      <div class="app__form-row">
        <input-field class="app__form-field"
          label="Event name"
          v-model="asset.details.name"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />
      </div>

      <div class="app__form-row">
        <input-field class="app__form-field"
          label="Host name"
          v-model="asset.details.host.name"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />

        <input-field class="app__form-field"
          label="Host email"
          v-model="asset.details.host.email"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />
      </div>

      <div class="app__form-row">
        <text-field
          v-model="asset.details.shortDescription"
          label="Short event description"
          :disabled="isExistingAsset || isPending"
          :required="false"
          :maxlength="250"/>
      </div>

      <div class="app__form-row">
        <text-field
          v-model="asset.details.longDescription"
          label="Full event description"
          :disabled="isExistingAsset || isPending"
          :required="false"
          :maxlength="1000"/>
      </div>

      <div class="ticket-manager__image-field-wrp">
        <label class="ticket-manager__image-lbl">Upload event icon</label>
        <image-field
          :fileKey="safeGet(asset, `details.icon.key`)"
          @change="onFileChange($event, 'ticketIcon', DOCUMENT_TYPES.tokenLogo)"
          :disabled="isExistingAsset || isPending"
          :notes="[
            'JPEG, PNG or BMP',
            'no more than 5mb',
            'not more than 48x48, 1:1'
          ]"/>
      </div>

      <div class="ticket-manager__image-field-wrp">
        <label class="ticket-manager__image-lbl">Upload event photo</label>
        <image-field
          :fileKey="safeGet(asset, `details.splash.key`)"
          @change="onFileChange($event, 'ticketPhoto', DOCUMENT_TYPES.tokenLogo)"
          :disabled="isExistingAsset || isPending"
          :notes="['JPEG, PNG or BMP']"/>
      </div>

      <div class="app__form-row">
        <input-field class="app__form-field"
          label="Ticket code"
          v-model="asset.code"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />

        <input-field class="app__form-field"
          type="number" :min="0" :step="1"
          label="Maximum available tickets"
          v-model="asset.maxIssuanceAmount"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />
      </div>

      <div class="app__form-row">
        <!-- hack with key is necessary for correct rendering when disableAfter and disableBefore is changed -->
        <div class="app__form-field">
          <date-field-flatpickr
            v-model="asset.details.eventStartsAt"
            name="event-start-time"
            id="event-start-time"
            :key="`ticket-manager-start-date-${asset.details.eventEndsAt}`"
            label="Event start time"
            :disabled="isExistingAsset || isPending"
            :disableAfter="asset.details.eventEndsAt"
            :disableBefore="yesterday"/>
        </div>

        <div class="app__form-field">
          <date-field-flatpickr
            v-model="asset.details.eventEndsAt"
            name="event-close-time"
            id="event-close-time"
            :key="`ticket-manager-end-date-${asset.details.eventStartsAt}`"
            label="Event end time"
            :disabled="isExistingAsset || isPending"
            :disableBefore="yesterday"/>
        </div>
      </div>

      <h3 class="app__form-title"> Event address </h3>

      <div class="app__form-row">
        <input-field class="app__form-field"
          label="City"
          v-model="asset.details.eventAddress.city"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />

        <input-field class="app__form-field"
          label="Institution"
          v-model="asset.details.eventAddress.institution"
          :disabled="isExistingAsset || isPending"
          :required="false"
        />
      </div>

      <div class="app__form-row">
        <input-field class="app__form-field"
          label="Full event address"
          v-model="asset.details.eventAddress.fullAddress"
          :disabled="isExistingAsset || isPending"
          :required="true"
        />
      </div>

      <h3 class="app__form-title"> Choose on the map where the event will take place </h3>

      <template v-if="isExistingAsset">
        <google-map @update-mark-position="updateMarkPosition"
                    class="ticket-manager__map"
                    :allow-to-change-mark-position="false"
                    :initial-coordinates="asset.details.eventCoordinates"
                    name="ticket-manager"/>
      </template>
      <template v-else>
        <google-map @update-mark-position="updateMarkPosition"
                    class="ticket-manager__map"
                    name="ticket-manager"/>
      </template>

      <div class="app__form-row">
        <div class="app__form-field app__form-field--halved">
          <select-field
            class="app-list-filters__field"
            label="Ticket type"
            :required="true"
            :disabled="isExistingAsset || isPending"
            v-model="asset.details.stylePreset">
            <option :value="STYLE_PRESETS.default">Default</option>
            <option :value="STYLE_PRESETS.vip">Vip</option>
          </select-field>
        </div>
      </div>

      <div class="app__form-actions">
        <button class="app__btn" :disabled="isPending">
          {{ isExistingAsset ? 'Update ticket' : 'Create ticket' }}
        </button>
      </div>

    </form>

  </div>
</template>

<script>
import api from '@/api'
import safeGet from 'lodash/get'
// import isEmpty from 'lodash/isEmpty'
import GoogleMap from './GoogleMap'

import {
  ImageField,
  TickField,
  InputField,
  TextField,
  DateFieldFlatpickr,
  SelectField
} from '@comcom/fields'
import {
  ASSET_POLICIES,
  DEFAULT_INPUT_STEP,
  DOCUMENT_TYPES,
  ASSET_POLICIES_VERBOSE,
  DEFAULT_GM_COORDS
} from '@/constants'
import { fileReader } from '../../../../utils/file-reader'
import { mapGetters } from 'vuex'
import { getters } from '@/store/types'
import moment from 'moment'

import 'mdi-vue/ChevronDownIcon'
import 'mdi-vue/ChevronUpIcon'

import { confirmAction } from '../../../../js/modals/confirmation_message'

const STYLE_PRESETS = Object.freeze({
  default: 'default',
  vip: 'vip'
})

const DEFAULT_TICKET_POLICY = ASSET_POLICIES.transferable | ASSET_POLICIES.requiresKyc | ASSET_POLICIES.canBeBaseInAtomicSwap

export default {
  components: {
    InputField,
    TickField,
    TextField,
    ImageField,
    DateFieldFlatpickr,
    SelectField,
    GoogleMap
  },

  props: ['assetCode'],

  data () {
    return {
      ASSET_POLICIES,
      STYLE_PRESETS,
      DEFAULT_INPUT_STEP,
      ASSET_POLICIES_VERBOSE,
      isShownAdvanced: false,
      paymentAssetsWithLink: ['UAH'],

      asset: {
        preissuedAssetSigner: '',
        policy: DEFAULT_TICKET_POLICY,
        details: {
          eventAddress: {},
          eventCoordinates: DEFAULT_GM_COORDS,
          eventStartsAt: '',
          eventEndsAt: '',
          host: {}
        }
      },

      ticketIcon: {
        file: null,
        mime: null,
        name: null
      },

      ticketPhoto: {
        file: null,
        mime: null,
        name: null
      },

      isPending: false,
      DOCUMENT_TYPES
    }
  },

  created () {
    if (this.isExistingAsset) {
      this.getAsset()
    }
    this.asset.preissuedAssetSigner = this.userAddress
  },

  computed: {
    ...mapGetters({ userAddress: getters.GET_USER_ADDRESS }),
    isExistingAsset () {
      return !!this.assetCode
    },
    yesterday () {
      return moment().subtract(1, 'd').format()
    }
  },

  methods: {
    safeGet,
    updateMarkPosition (position) {
      this.asset.details.eventCoordinates.latitude = position.latitude
      this.asset.details.eventCoordinates.longitude = position.longitude
    },
    hasLinkToPayment (asset) {
      return this.paymentAssetsWithLink.includes(asset)
    },
    async getAsset () {
      try {
        this.asset = await api.assets.getAssetByCode(this.assetCode)
        this.asset.policy = DEFAULT_TICKET_POLICY
        // if (isEmpty(this.asset.details.eventCoordinates)) {
        this.asset.details.eventCoordinates = DEFAULT_GM_COORDS
        // }
      } catch (error) {
        console.error(error)
        this.$store.dispatch('SET_ERROR', 'Receiving asset failed. Please try again later')
      }
    },

    async submit () {
      if (!await confirmAction()) return

      this.isPending = true
      try {
        await Promise.all([
          this.uploadFile('ticketIcon', DOCUMENT_TYPES.tokenLogo),
          this.uploadFile('ticketPhoto', DOCUMENT_TYPES.tokenLogo)
        ])
        if (this.isExistingAsset) {
          await api.assetCreation.updateAsset(this.asset)
        } else {
          await api.assetCreation.createAsset(this.asset)
        }
        this.$store.dispatch('SET_INFO', 'Submitted successfully.')
        this.$router.push({ name: 'systemAssets.index' })
      } catch (error) {
        error.showMessage()
      }
      this.isPending = false
    },

    async onFileChange (event, localType, type) {
      console.log(type)
      const file = fileReader.deriveFileFromChangeEvent(event)
      this[localType].file = file
      this[localType].mime = file.type
      this[localType].name = file.name
    },

    async uploadFile (localType, type) {
      if (!this[localType].file) return
      const config = (await api.users
        .docsOf(this.$store.getters.masterId)
        .getUploadConfig(type, this[localType].mime))
        .data
      await api.documents.uploadFile(this[localType].file, config, this[localType].mime)
      this.asset.details[localType === 'ticketIcon' ? 'icon' : 'splash'] = {
        key: config.key,
        name: this[localType].name,
        type: this[localType].mime
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/scss/colors";
.ticket-manager {
  position: relative;
  padding-top: 3rem;
}

.ticket-manager__current-wrp {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  width: 30rem;
  top: -7rem; // WARN: magic number
  right: 0;

  .highlight {
    color: $color-info;
  }
}

.ticket-manager__map {
  height: 400px;
}

.ticket-manager__file-input-inner {
  display: flex;
  align-items: center;
}

.ticket-manager__image-field-wrp {
  margin-top: 2.5rem;
  margin-bottom: 3rem;
}

.ticket-manager__image-lbl {
  display: block;
  margin-bottom: .5rem;
}

.ticket-manager__file-input-wrp {
  margin: 3rem 0;
}

.ticket-manager__file-name {
  margin-left: 1rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  white-space: nowrap;
}

.ticket-manager__current-issuance-details {
  flex: 1;
}

.ticket-manager__current-issuance-details {
  display: flex;
  flex-direction: column;

  .available,
  .issued {
    display: flex;
    line-height: 2.1rem;

    .amount {
      flex: 0.4;
      // margin-right: 0.7rem;
      text-align: right;
    }

    label {
      flex: 0.6;
    }
  }
}

.ticket-manager-advanced__heading {
  color: $color-active;
  display: flex;
  line-height: 100%;
  align-items: center;

  h3 {
    margin-right: 1rem;
  }
}

.ticket-manager-advanced__block {
  margin: 2rem 0;
}
</style>
