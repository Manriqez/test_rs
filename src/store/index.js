import { createStore } from 'vuex'
import db from '@/db/hotels.json'

export default createStore({
  state () {
    return {
      hotels: db.hotels
    }
  },
  getters: {
    getHotels (state) {
      return state.hotels
    }
  }
})
