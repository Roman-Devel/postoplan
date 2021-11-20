import moment from 'moment'
import axios from 'axios'

export default {
  namespaced: true,
  actions: {
    async request () {
      try {
        const { data } = await axios.get(`https://ipinfo.io?token=${process.env.VUE_APP_TOKEN_IP}`)

        const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&q=${data.city}&appid=${process.env.VUE_APP_WEATHER_KEY}`
        const { data: dataGet } = await axios.get(url)

        const currentCity = {
          time: moment().format(),
          city: dataGet.name,
          country: dataGet.sys.country,
          weather: dataGet.weather[0].main,
          temp: Math.floor(dataGet.main.temp),
          hum: dataGet.main.humidity
        }

        if (localStorage.getItem('currentCity') === null) {
          localStorage.setItem('currentCity', JSON.stringify(currentCity))
        }
      } catch (e) {}
    },
    async update () {
      try {
        const city = JSON.parse(localStorage.getItem('currentCity')).city
        const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&q=${city}&appid=${process.env.VUE_APP_WEATHER_KEY}`
        const { data } = await axios.get(url)

        const updateCity = {
          time: moment().format(),
          city: data.name,
          country: data.sys.country,
          weather: data.weather[0].main,
          temp: Math.floor(data.main.temp),
          hum: data.main.humidity
        }

        localStorage.setItem('currentCity', JSON.stringify(updateCity))
      } catch (e) {}
    }
  }
}
