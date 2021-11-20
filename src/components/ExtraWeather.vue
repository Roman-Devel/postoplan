<template>
  <section>
    <div :class="['card', { 'card_loading': loading }]">
      <p class="card__title">{{ extra.city }}</p>
      <p class="card__subtitle">{{ extra.country }}</p>

      <div class="info">
        <div class="info__left">Weather</div>
        <div class="info__right">{{ extra.weather }}</div>
      </div>

      <div class="info">
        <div class="info__left">Temperature</div>
        <div class="info__right">{{ extra.temp }} °C</div>
      </div>

      <div class="info">
        <div class="info__left">Humidity</div>
        <div class="info__right">{{ extra.hum }} %</div>
      </div>

      <div class="passed-time" :key="keyUpdate">{{ time(extra.time) }}</div>

      <div class="control">
        <div class="control__remove" @click="remove">remove</div>
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
  name: 'extra',
  emits: ['deleted'],
  props: {
    extra: {
      type: Object,
      required: true
    }
  },
  setup (props, { emit }) {
    const store = useStore()
    const keyUpdate = ref(0)
    const timer = ref(null)
    const loading = ref(false)

    onMounted(() => {
      timer.value = setInterval(() => {
        keyUpdate.value++
      }, 30000)
    })

    onBeforeUnmount(() => clearInterval(timer.value))

    const remove = () => {
      try {
        loading.value = true
        setTimeout(async () => {
          await store.dispatch('removeCity', props.extra.dbId)
          emit('deleted', props.extra.dbId)
          loading.value = false
        }, 500)
      } catch (e) {}
    }

    const reload = () => {
      try {
        loading.value = true
        setTimeout(async () => {
          await store.dispatch('updateWeather', {
            id: props.extra.dbId,
            city: props.extra.city
          })
          loading.value = false
        }, 500)
      } catch (e) {}
    }

    return {
      remove,
      reload,
      time,
      keyUpdate,
      loading
    }
  }
}
</script>

<style scoped>
  .card {
    margin-bottom: 0;
    min-width: 325px;
    max-width: 350px;
  }
</style>
