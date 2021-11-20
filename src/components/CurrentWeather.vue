<template>
  <section v-if="cityFound">
    <p class="above-title">Watch weather in your current location</p>
    <div :class="['card', { 'card_loading': loading }]">
      <p class="card__title">{{ current.city }}, {{ current.country }}</p>
      <p class="card__subtitle">Your current location</p>

      <div class="info">
        <div class="info__left">Weather</div>
        <div class="info__right">{{ current.weather }}</div>
      </div>

      <div class="info">
        <div class="info__left">Temperature</div>
        <div class="info__right">{{ current.temp + ' °C' }}</div>
      </div>

      <div class="info">
        <div class="info__left">Humidity</div>
        <div class="info__right">{{ current.hum + ' %'}}</div>
      </div>

      <div class="passed-time" :key="keyUpdate">{{ time(current.time) }}</div>

      <div class="control control_alone">
        <div class="control__reload" @click="reload">reload</div>
      </div>
      <Loader v-if="loading"/>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { time } from '../utils/time'

export default {
  name: 'current',
  setup () {
    const store = useStore()
    const keyUpdate = ref(0)
    const timer = ref(null)
    const cityFound = ref(false)
    const current = ref(null)
    const loading = ref(false)

    const reload = () => {
      try {
        loading.value = true
        setTimeout(async () => {
          await store.dispatch('currentCity/update')
          current.value = JSON.parse(localStorage.getItem('currentCity'))
          loading.value = false
        }, 500)
      } catch (e) {}
    }

    onMounted(async () => {
      timer.value = setInterval(() => {
        keyUpdate.value++
      }, 30000)

      await store.dispatch('currentCity/request')

      setTimeout(() => {
        if (localStorage.getItem('currentCity') !== null) {
          current.value = JSON.parse(localStorage.getItem('currentCity'))
          cityFound.value = true
        }
      }, 400)
    })

    onBeforeUnmount(() => clearInterval(timer.value))

    return {
      current,
      time,
      reload,
      keyUpdate,
      cityFound,
      loading
    }
  }
}
</script>

<style scoped>
  .card {
    margin-top: 20px;
    margin-bottom: 40px;
  }
</style>
