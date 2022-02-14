<template >
  <div class="card mb-2" v-for="(hotel, idx) in filtered" :key="hotel">
    <div class="card-title-wrapper">
      <h2 class="card-title">
      {{ hotel.name }}
      </h2>
      <div class="card-price">
      {{ hotel.min_price }} ₽
      </div>
  </div>
  <div class="hotel-stats mb-2">
      <span class="hotel-stats__stars">{{ hotel.stars + '' + starsTextFormat(idx+1) }}</span>
      <span class="hotel-stats__type">{{ hotel.type }}</span>
      <span class="hotel-stats__review_amount">{{ hotel.reviews_amount }}</span>
      <span class="hotel-stats__country">{{ hotel.country }}</span>
  </div>
  <div class="hotel-description">
      {{ hotel.description }}
  </div>
  <p>
      <strong>
      <small>
      </small>
      </strong>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      reqiured: true
    }
  }
}
</script>

<style>
  .card-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
