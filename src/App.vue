<template>
  <header>
    <p>World Weather</p>
  </header>
  <Loader v-show="loading" />
  <div v-show="!loading">
    <main>
      <CurrentWeather />
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
  </div>
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
    const loading = ref(true)

    const filter = id => {
      dataExtra.value = dataExtra.value.filter(city => city.dbId !== id)
    }

    const addNewCity = city => dataExtra.value.push(city)

    onMounted(() => {
      try {
        setTimeout(async () => {
          await store.dispatch('load')
          dataExtra.value.push(...store.getters.extraWeather)
          loading.value = false
        }, 700)
      } catch (e) {}
    })

    return {
      dataExtra,
      filter,
      addNewCity,
      loading
    }
  },
  components: {
    CurrentWeather,
    ExtraWeather,
    TheModal
  }
}
</script>
