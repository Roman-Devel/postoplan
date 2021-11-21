import { createStore } from 'vuex'
import axios from 'axios'
import moment from 'moment'
import currentCity from './modules/currentCity.module'

export default createStore({
  state: {
    extraWeather: []
  },
  mutations: {
    addExtra (state, city) {
      state.extraWeather.push(...city)
    },
    filterExtra (state, id) {
      state.extraWeather = state.extraWeather.filter(city => city.dbId !== id)
    },
    updateExtra (state, payload) {
      state.extraWeather = state.extraWeather
        .filter(city => city.dbId === payload.id)
        .map(key => {
          key.time = moment().format()
          key.weather = payload.weather
          key.temp = payload.temp
          key.hum = payload.hum
        })
    }
  },
  actions: {
    async load ({ commit }) {
      try {
        const { data } = await axios.get(process.env.VUE_APP_DB_URL + 'cities.json')
        commit('addExtra', Object.keys(data).map(key => ({ ...data[key], dbId: key })))
      } catch (e) {}
    },
    async addCity ({ commit }, { search }) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&q=${search}&appid=${process.env.VUE_APP_WEATHER_KEY}`
        const { data: dataGet } = await axios.get(url)

        const newCity = {
          time: moment().format(),
          city: dataGet.name,
          country: dataGet.sys.country,
          weather: dataGet.weather[0].main,
          temp: Math.floor(dataGet.main.temp),
          hum: dataGet.main.humidity
        }

        const { data } = await axios.post(process.env.VUE_APP_DB_URL + 'cities.json', newCity)
        commit('addExtra', [{ ...newCity, dbId: data.name }])

        return { ...newCity, dbId: data.name }
      } catch (e) {
        throw new Error(`City "${search}" not found`)
      }
    },
    async removeCity ({ commit }, id) {
      try {
        await axios.delete(process.env.VUE_APP_DB_URL + `cities/${id}.json`)
        commit('filterExtra', id)
      } catch (e) {
        console.log(e.message)
      }
    },
    async updateWeather ({ commit }, { id, city }) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&q=${city}&appid=${process.env.VUE_APP_WEATHER_KEY}`
        const { data } = await axios.get(url)

        const updateCity = {
          time: moment().format(),
          weather: data.weather[0].main,
          temp: Math.floor(data.main.temp),
          hum: data.main.humidity
        }

        await axios.patch(process.env.VUE_APP_DB_URL + `cities/${id}.json`, updateCity)
        commit('updateExtra', { ...updateCity, id })
      } catch (e) {}
    }
  },
  getters: {
    extraWeather: state => state.extraWeather
  },
  modules: {
    currentCity
  }
})
