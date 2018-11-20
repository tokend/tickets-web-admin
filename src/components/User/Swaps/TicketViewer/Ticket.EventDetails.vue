<template>
  <div class="ticket-event-details">
    <div class="ticket-event-details__attribute">
      <div class="ticket-event-details__attribute-column
        ticket-event-details__attribute-column--icon">
        <mdi-clock-icon class="ticket-event-details__attribute-icon"/>
      </div>
      <div class="ticket-event-details__attribute-column">
        <span class="ticket-event-details__attribute-date">
          Event starts at
          {{ formatDate(ticket.eventStartsAt) }}
        </span>
        <span class="ticket-event-details__attribute-date">
          Event ends at
          {{ formatDate(ticket.eventEndsAt) }}
        </span>
      </div>
    </div>

    <div class="ticket-event-details__attribute">
      <div class="ticket-event-details__attribute-column
        ticket-event-details__attribute-column--icon">
        <mdi-map-marker-icon class="ticket-event-details__attribute-icon"/>
      </div>
      <div class="ticket-event-details__attribute-column">
        <span class="ticket-event-details__city">
          {{ ticket.eventAddress.city }}
        </span>
        <span class="ticket-event-details__institution">
          {{ ticket.eventAddress.institution }}
        </span>
        <span class="ticket-event-details__full-address">
          {{ ticket.eventAddress.fullAddress }}
        </span>
      </div>
    </div>

    <div class="ticket-event-details__attribute">
      <div class="ticket-event-details__attribute-column
        ticket-event-details__attribute-column--icon">
        <mdi-email-icon class="ticket-event-details__attribute-icon"/>
      </div>
      <div class="ticket-event-details__attribute-column">
        <span class="ticket-event-details__host-name">
          {{ ticket.host.name }}
        </span>
        <span class="ticket-event-details__host-email">
          {{ ticket.host.email }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '../../../../utils/formatters'

  import 'mdi-vue/MapMarkerIcon'
  import 'mdi-vue/EmailIcon'
  import 'mdi-vue/ClockIcon'

  export default {
    props: ['ticket'],
    methods: {
      formatDate
    }
  }
</script>

<style lang='scss'>
  @import "../../../../assets/scss/colors";

  $attribute-margin: 2.4rem;
  .ticket-event-details,
  .ticket-event-details__attribute,
  .ticket-event-details__attribute-column {
    display: flex;
    width: 100%;
    flex: 1;
    color: $color-text;
  }

  .ticket-event-details {
    flex-direction: row;
    flex-wrap: wrap;
    width: calc(100% + #{$attribute-margin});
    margin: 0 -$attribute-margin;
  }

  .ticket-event-details__attribute {
    min-width: 20rem;
    margin: $attribute-margin;
  }

  .ticket-event-details__attribute-column {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    &--icon {
      flex: 0;
    }
  }

  .ticket-event-details__attribute-icon {
    margin: 0 1.4rem 0 auto;
    color: $color-text-secondary !important;
  }

  .ticket-event-details__attribute-date {
    font-size: 1.6rem;
  }

  .ticket-event-details__city,
  .ticket-event-details__host-name {
    font-size: 1.6rem;
  }

  .ticket-event-details__institution,
  .ticket-event-details__full-address,
  .ticket-event-details__host-email {
    font-size: 1.4rem;
  }
</style>
