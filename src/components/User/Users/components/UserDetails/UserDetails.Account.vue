<template>
  <div class="user-details-account">
    <h3>Account information</h3>
    <ul class="key-value-list">
      <li>
        <span>Email</span>
        <span :title="user.email">{{user.email}}</span>
      </li>
      <li>
        <span>Account ID</span>
        <span :title="user.id">{{user.id}}</span>
      </li>
      <li>
        <span>Account type</span>
        <span :title="ACCOUNT_TYPES_VERBOSE[account.accountType]">
          <template v-if="ACCOUNT_TYPES_VERBOSE[account.accountType] === 'Corporate'">Artist</template>
          <template v-else>{{ACCOUNT_TYPES_VERBOSE[account.accountType]}}</template>
        </span>
      </li>


      <template v-if="user.state === USER_STATES_STR.rejected">
        <label class="data-caption">Reject reason</label>
        <p class="text">
          {{user.rejectReason}}
        </p>
      </template>
    </ul>

  </div>
</template>

<script>
import { USER_STATES_STR } from '@/constants'

const ACCOUNT_TYPES_VERBOSE = {
  AccountTypeNotVerified: 'Not verified',
  AccountTypeGeneral: 'General',
  AccountTypeSyndicate: 'Corporate'
}

export default {
  data () {
    return {
      USER_STATES_STR,
      ACCOUNT_TYPES_VERBOSE
    }
  },

  props: ['user', 'account']
}
</script>

<style scoped>

</style>
