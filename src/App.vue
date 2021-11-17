<template>
  <header>
    <p>World Weather</p>
  </header>

  <main>
    <CurrentWeather v-if="cityFound" />
  </main>

  <footer v-if="dataExtra">
    <ExtraWeather
      v-for="city in dataExtra"
      :key="city.dbId"
      :extra="city"
      @deleted="filter"
    />
  </footer>
  <p class="emptyWeather" v-else>--- Add a weather card ---</p>
  <TheModal
    @added="addNewCity"
  />
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import CurrentWeather from './components/CurrentWeather.vue'
import ExtraWeather from './components/ExtraWeather.vue'
import TheModal from './components/TheModal.vue'

export default {
  name: 'App',
  setup () {
    const store = useStore()
    const dataExtra = ref([])
    const cityFound = ref(false)

    if (localStorage.getItem('currentCity') !== null) {
      cityFound.value = true
    }

    const filter = id => {
      dataExtra.value = dataExtra.value.filter(city => city.dbId !== id)
    }

    const addNewCity = city => dataExtra.value.push(city)

    onMounted(async () => {
      try {
        await store.dispatch('currentCity/request')
        await store.dispatch('load')
        dataExtra.value.push(...store.getters.extraWeather)
      } catch (e) {}
    })

    return {
      dataExtra,
      filter,
      addNewCity,
      cityFound
    }
  },
  components: {
    CurrentWeather,
    ExtraWeather,
    TheModal
  }
}
</script>
