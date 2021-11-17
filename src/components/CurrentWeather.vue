<template>
  <section>
    <p class="above-title">Watch weather in your current location</p>
    <div class="card">
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
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { time } from '../use/time'

export default {
  name: 'current',
  setup () {
    const store = useStore()
    const keyUpdate = ref(0)
    const timer = ref(null)
    const current = ref(JSON.parse(localStorage.getItem('currentCity')))

    const reload = async () => {
      try {
        await store.dispatch('currentCity/update')
        current.value = JSON.parse(localStorage.getItem('currentCity'))
      } catch (e) {}
    }

    onMounted(() => {
      timer.value = setInterval(() => {
        keyUpdate.value++
      }, 60000)
    })

    onBeforeUnmount(() => {
      clearInterval(timer.value)
    })

    return {
      current,
      time,
      reload,
      keyUpdate
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
