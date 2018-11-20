<template>
  <div>
    <section class="ticket-details__section">
      <h1 class="ticket-details__heading"> {{ ticket.name }} ({{ ticket.code }})</h1>
      <p class="ticket-details__short-description">{{ ticket.shortDescription }}</p>

      <div class="ticket-details__ticket-splash-wrp">
        <img class="ticket-details__ticket-splash-img md-image"
             :src="splashUrl"
             :alt="ticket.name">
      </div>
    </section>

    <section class="ticket-details__section">
      <h3 class="ticket-details__section-heading">Ticket description</h3>
      <p class="ticket-details__long-description"
         v-html="ticket.longDescription">
      </p>
    </section>

    <section class="ticket-details__row-section">
      <div class="ticket-details__row-section-item">
        <ticket-event-details :ticket="ticket" />
      </div>
    </section>
  </div>
</template>

<script>
  import TicketEventDetails from './Ticket.EventDetails'

  import config from '../../../../config'

  export default {
    name: 'ticket-details',
    props: ['ticket'],
    components: {
      TicketEventDetails
    },
    computed: {
      splashUrl () {
        return `${config.STORAGE_SERVER}/${this.ticket.splash.key}`
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../../assets/scss/colors';

  $ratio_16: 100%;
  $ratio_9: $ratio_16 * (9/16);

  .ticket-details {
    max-width: 1000px;
    margin: 0 auto;
  }

  .ticket-details__ticket-splash-wrp {
    position: relative;
    padding-bottom: $ratio_9;
    width: 100%;
    margin-top: 2.4rem;
  }

  .ticket-details__ticket-splash-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ticket-details__heading {
    font-size: 2rem;
    line-height: 1.5;
    margin: 0 0 0.8rem;
    vertical-align: middle;
    color: $color-text;
    opacity: 1;
  }

  .ticket-details__short-description {
    font-size: 1.6rem;
    color: $color-text-secondary;
    line-height: 1.5;
  }

  .ticket-details__section {
    margin: 4.8rem 0;
    &:first-of-type {
      margin-top: 0;
    }
  }

  $row-section-item-margin: 2.4rem;
  .ticket-details__row-section {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + $row-section-item-margin);
    margin: 0 -$row-section-item-margin;

  }

  .ticket-details__row-section-item {
    flex: 1;
    margin: $row-section-item-margin;
    min-width: 28rem;
  }

  .ticket-details__section-heading {
    margin-bottom: 1rem;
    color: $color-text;
  }

  .ticket-details__long-description {
    font-size: 1.6rem;
    line-height: 1.5;
    color: $color-text;
  }

  .ticket-details__map-wrp {
    position: relative;
    padding-bottom: 100% * (9/16);
    height: 0;
    background-color: silver;

    & > .ticket-details__map {
      position: absolute;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
</style>
