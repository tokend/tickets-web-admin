<template>
  <div class="request-reviewer">

    <template v-if="request.requestStateI === REQUEST_STATES.pending">
      <div class="request-reviewer__actions app__form-actions">
        <button class="app__btn" @click="approve" :disabled="isPending">Approve</button>
        <button class="app__btn app__btn--danger"
               :disabled="isPending"
               @click="rejectModal.isShown = true">Reject</button>
      </div>
    </template>

    <template v-else>
      <span>Request is {{ request.requestState }} already</span>
    </template>

    <template v-if="rejectModal.isShown">
      <modal @close-request="rejectModal.isShown = false" max-width="40rem">
        <p class="text">Reject reason</p>

        <form class="request-reviewer__reject-form" id="bid-reject-form"
              @submit.prevent="reject()">
          <div class="app__form-row">
            <text-field v-model="rejectModal.reason" :label="null"/>
          </div>
        </form>

        <div class="request-reviewer_reject-form-actions app__form-actions">
          <button class="app__btn app__btn--danger"
                  type="submit"
                  form="bid-reject-form"
                  :disabled="isPending"
          >
            Reject
          </button>
          <button class="app__btn-secondary"
                  type="button"
                  @click="rejectModal.isShown = false"
                  :disabled="isPending"
          >
            Cancel
          </button>
        </div>
      </modal>
    </template>


  </div>
</template>

<script>
  import { REQUEST_STATES } from '../../../../constants'
  import { TextField } from '../../../common/fields'
  import Modal from '@comcom/modals/Modal'

  import api from '@/api'

  export default {
    props: ['request'],
    components: {
      Modal,
      TextField
    },
    data: _ => ({
      rejectModal: {
        isShown: false,
        reason: ''
      },
      isPending: false,
      REQUEST_STATES
    }),
    methods: {
      async reject () {
        this.isPending = true
        try {
          this.rejectModal.isShown = false
          await api.requests.reject({
            reason: this.rejectModal.reason,
            isPermanent: true
          }, this.request)
          this.$store.dispatch('SET_INFO', 'Bid rejected')
          this.$router.push({ name: 'swaps.bid-requests' })
        } catch (e) {
          console.error(e)
          e.showMessage()
        }
        this.isPending = false
        this.rejectModal.isShown = false
      },
      async approve () {
        this.isPending = true
        try {
          await api.requests.approve(this.request)
          this.$store.dispatch('SET_INFO', 'Bid opened')
          this.$router.push({ name: 'swaps.bid-requests' })
        } catch (e) {
          console.error(e)
          e.showMessage()
        }
        this.isPending = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .request-reviewer__reject-form {
    margin-bottom: 3rem;
  }
</style>
