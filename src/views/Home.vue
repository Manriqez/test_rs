<template>
<div>
<div class="home-wrapper">
  <div class="left-side-block filters">

    <h3>Страна</h3>
    <div class="country-filter card mb-2">
      <form>
        <input type="text" placeholder="Поиск стран" v-model="search">
        <button v-if="search.length > 0" @click.prevent="resetInput">&times;</button>
      </form>
      <ul>
          <li v-for="(country, idx) in findCountry" :key="country">
            <input
              type="checkbox"
              :id="'country' + idx"
              :value="country"
              v-model="selectedCountries"
            >
            <label :for="'country' + idx" >{{ country }}</label>
          </li>
      </ul>
    </div>
    <h3>Тип</h3>
    <div class="type-filter card mb-2">
      <ul>
        <li v-for="(type, idx) in uniqueHotelFilters.type" :key="type">
          <input
            type="checkbox"
            :id="'type' + idx"
            :value="type"
            v-model="selectedTypes"
          >
          <label :for="'type' + idx">{{ type }}</label>
        </li>
      </ul>
    </div>

    <h3>Количество звезд</h3>
    <div class="stars-filter card mb-2">
      <ul>
        <li v-for="(star, idx) in hotels" :key="star">
          <input
            type="checkbox"
            :id="'stars' + idx"
            :value="idx+1"
            v-model="selectedStars"
          >
          <label :for="'stars' + idx">{{ idx+1 + ' ' + starsTextFormat(idx) }}</label>
        </li>
      </ul>
    </div>

    <h3>Количество отзывов (от)</h3>
    <div class="reviews-filter card mb-2">
      <ul>
        <li>
          <input
            type="number"
            id="reviews"
            v-model.number="review_amount"
            placeholder="Например, от 10"
          >
        </li>
      </ul>
    </div>

    <h3>Цена</h3>
    <div class="price-filter card mb-2">
      <div class="range-slider">
        <span class="output outputOne">{{ min }}</span>
        <span class="output outputTwo">{{ max }}</span>
        <span class="full-range"></span>
        <span class="incl-range"></span>
        <input min="0" max="4000" step="10" type="range" v-model.number="min" @change="validateRange">
        <input min="0" max="4000" step="10" type="range" v-model.number="max" @change="validateRange">
      </div>
    </div>

      <button @click="applyFilter">Применить фильтр</button>
      <button @click="resetFilter">Сбросить фильтр</button>

  </div>
  <div class="right-side-block card-items">
    <h1 class="text-white center" v-if="filtered.length === 0">Не найдено</h1>
    <paginated-list :list-data="filtered" v-else></paginated-list>
  </div>
</div>
</div>
</template>

<script>
import PaginatedList from '../components/PaginatedList.vue'
export default {
  name: 'App',
  data () {
    return {
      search: '',
      hotels: this.$store.getters.getHotels,
      filtered: this.$store.getters.getHotels,
      pageNumber: 0,
      selectedCountries: [],
      selectedTypes: [],
      selectedStars: [],
      review_amount: '',
      min: '',
      max: '',
      uniqueHotelFilters: {
        country: [],
        type: [],
        price: {
          min: '',
          max: ''
        }
      }
    }
  },
  computed: {
    findCountry () {
      return this.uniqueHotelFilters.country.filter(item => item.toLowerCase().indexOf(this.search.toLowerCase()) !== -1)
    }
  },
  methods: {
    applyFilter () {
      this.filtered = this.hotels
        // country
        .filter(hotel => {
          const selectedCountries = []
          for (const i in this.selectedCountries) {
            selectedCountries.push(this.selectedCountries[i])
          }
          return this.selectedCountries.length === 0 || selectedCountries.includes(hotel.country)
        })
        // type
        .filter(hotel => {
          const selectedTypes = []
          for (const i in this.selectedTypes) {
            selectedTypes.push(this.selectedTypes[i])
          }
          return this.selectedTypes.length === 0 || selectedTypes.includes(hotel.type)
        })
        .filter(hotel => {
          const selectedStars = []
          for (const i in this.selectedStars) {
            selectedStars.push(this.selectedStars[i])
          }
          return this.selectedStars.length === 0 || selectedStars.includes(hotel.stars)
        })
        // review_amount
        .filter(hotel => {
          return this.review_amount.length === 0 || hotel.reviews_amount >= this.review_amount
        })
        // price
        .filter(hotel => {
          return hotel.min_price >= this.min && hotel.min_price <= this.max
        })
      if (this.filtered.length === 0) {
        return 0
      }
    },
    resetFilter () {
      this.selectedCountries = []
      this.selectedTypes = []
      this.selectedStars = []
      this.review_amount = ''
      this.min = this.uniqueHotelFilters.price.min
      this.max = this.uniqueHotelFilters.price.max
      console.log(this.min)
      console.log(this.uniqueHotelFilters.price.min)
      this.applyFilter()
    },
    starsTextFormat (idx) {
      if (idx === 0) {
        return 'звезда'
      } else if (idx === 4) {
        return 'звезд'
      } else return 'звезды'
    },
    resetInput () {
      this.search = ''
    },
    validateRange () {
      if (this.uniqueHotelFilters.price.min > this.uniqueHotelFilters.price.max) {
        const tmp = this.uniqueHotelFilters.price.max
        this.uniqueHotelFilters.price.max = this.uniqueHotelFilters.price.min
        this.uniqueHotelFilters.price.min = tmp
      }
    }
  },
  beforeMount () {
    const uniqueCountry = new Set()
    this.hotels.forEach(item => uniqueCountry.add(item.country))

    const uniqueType = new Set()
    this.hotels.forEach(item => uniqueType.add(item.type))

    let prices = new Set()
    this.hotels.forEach(item => prices.add(item.min_price))
    prices = Array.from(prices)

    this.uniqueHotelFilters.country = Array.from(uniqueCountry)
    this.uniqueHotelFilters.type = Array.from(uniqueType)

    this.min = this.uniqueHotelFilters.price.min = Math.min(...prices)
    this.max = this.uniqueHotelFilters.price.max = Math.max(...prices)
    console.log(this.min)
    console.log(this.uniqueHotelFilters.price.min)
  },
  components: {
    PaginatedList
  }
}
</script>

<style>
  .home-wrapper {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 30px;
  }

  .country-filter {
    max-height: 160px;
    overflow: auto;
  }

  .hotel-stats span:not(:last-child){
    margin-right: 10px;
  }

  .range-slider {
    position: relative;
    width: 200px;
    height: 35px;
    text-align: center;
  }

.range-slider input[type="range"] {
    pointer-events: none;
    cursor: pointer;
    position: absolute;
    overflow: hidden;
    left: 0;
    bottom: -6px;
    width: 200px;
    outline: none;
    height: 18px;
    margin: 0;
    padding: 0;
}

.range-slider input::-webkit-slider-thumb {
    pointer-events: all;
    position: relative;
    z-index: 1;
    outline: 0;
}

.range-slider input::-moz-range-thumb {
    pointer-events: all;
    position: relative;
    z-index: 10;
    -moz-appearance: none;
    width: 9px;
}

.range-slider input::-moz-range-track {
    position: relative;
    z-index: -1;
    background-color: rgba(0, 0, 0, 1);
    border: 0;
}

.range-slider input:last-of-type::-moz-range-track {
    -moz-appearance: none;
    background: none transparent;
    border: 0;
}

.range-slider input[type=range]::-moz-focus-outer {
  border: 0;
}

.rangeValue {
  width: 30px;
}

.output {
  border:1px solid #999;
  width: 80px;
  height: 30px;
  text-align: center;
  color: #999;
  border-radius: 4px;
  display: inline-block;
  transform: translateY(-10px);
}

.outputOne, .outputTwo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.outputOne {
  float: left;
}

.outputTwo {
  float: right;
}

input[type=range] {
  -webkit-appearance: none;
  background: none;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 5px;
  border: none;
  border-radius: 3px;
  background: transparent;
}

input[type=range]::-ms-track {
  height: 5px;
  background: transparent;
  border: none;
  border-radius: 3px;
}

input[type=range]::-moz-range-track {
  height: 5px;
  background: transparent;
  border: none;
  border-radius: 3px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #555;
  margin-top: -5px;
  position: relative;
  z-index: 10000;
}

input[type=range]::-ms-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #555;
  margin-top: -5px;
  position: relative;
  z-index: 10000;
}

input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #555;
  margin-top: -5px;
  position: relative;
  z-index: 10000;
}

input[type=range]:focus {
  outline: none;
}

.full-range,
.incl-range {
  width: 100%;
  height: 5px;
  left: 0;
  bottom: 0;
  position: absolute;
  background: #DDD;
}

.incl-range {
  background: gold;
}
</style>
