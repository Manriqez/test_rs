<template>
  <div class="card mb-2" v-for="hotel in paginatedData" :key="hotel">
    <div class="card-title-wrapper">
      <h2 class="card-title">
        {{ hotel.name }}
      </h2>
      <div class="card-price">
        {{ hotel.min_price }} ₽
      </div>
    </div>
    <div class="hotel-stats mb-2">
        <span class="hotel-stats__stars">{{ hotel.stars + ' ' + starsTextFormat(hotel.stars) }}</span>
        <span class="hotel-stats__type">{{ hotel.type }}</span>
        <span class="hotel-stats__review_amount">Кол-во отзывов: {{ hotel.reviews_amount }}</span>
        <span class="hotel-stats__country">{{ hotel.country }}</span>
        <span></span>
    </div>
    <div class="hotel-description">
        {{ hotel.description }}
    </div>
  </div>

  <ul v-if="filteredList.length > 3 || currentPage > 1" class="paginate-panel">
    <li>
      <button type="button" @click="onClickFirstPage" :disabled="isInFirstPage"> first </button>
    </li>

    <li>
      <button type="button" @click="onClickPreviousPage" :disabled="isInFirstPage"> prev </button>
    </li>

    <li v-for="(page, index) in  pages" :key="index">
      <button type="button" @click="onClickPage(page.number)" :class="{ active: isPageActive(page.number) }">
        {{ page.number }}
      </button>
    </li>

    <li>
      <button type="button" @click="onClickNextPage" :disabled="isInLastPage"> next </button>
    </li>

    <li>
      <button type="button" @click="onClickLastPage" :disabled="isInLastPage"> last </button>
    </li>
  </ul>
</template>

<script>
export default {
  emits: ['pagechanged'],
  props: {
    filteredList: {
      type: Array,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      perPage: 3,
      maxVisibleButtons: 3
    }
  },
  computed: {
    paginatedData () {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredList.slice(start, end)
    },
    startPage () {
      if (this.currentPage === 1) return 1
      if (this.currentPage === this.totalPages) return this.totalPages - this.maxVisibleButtons + (this.maxVisibleButtons - 1)
      return this.currentPage - 1
    },
    endPage () { return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages) },
    pages () {
      const range = []
      for (let i = this.startPage; i <= this.endPage; i += 1) {
        range.push({
          number: i,
          isDisabled: i === this.currentPage
        })
      }
      return range
    },
    isInFirstPage () { return this.currentPage === 1 },
    isInLastPage () { return this.currentPage === this.totalPages }
  },
  methods: {
    onClickFirstPage () {
      this.$emit('pagechanged', 1)
    },
    onClickPreviousPage () {
      this.$emit('pagechanged', this.currentPage - 1)
    },
    onClickPage (page) {
      this.$emit('pagechanged', page)
    },
    onClickNextPage () {
      this.$emit('pagechanged', this.currentPage + 1)
    },
    onClickLastPage () {
      this.$emit('pagechanged', this.totalPages)
    },
    isPageActive (page) {
      return this.currentPage === page
    },
    starsTextFormat (idx) {
      if (idx === 0) {
        return 'звезда'
      } else if (idx === 5) {
        return 'звезд'
      } else return 'звезды'
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
  .paginate-panel {
    display: flex;
    justify-content: center;
  }
  .active {
    border-color: red;
  }
</style>
