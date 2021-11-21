<template>
  <button class="addBtn" @click="isActive = true">+</button>
  <template v-if="isActive">
    <div class="backdrop" @click="cancel"></div>
    <form class="modal" @submit.prevent="onSubmit">
      <p class="modal__title">Choose a city</p>
      <p class="modal__subtitle">To find city start typing and pick one from the suggestions</p>

      <input
        type="text"
        placeholder="Search city"
        :class="['modal__search', {'modal__search_invalid': sError}]"
        v-model="search"
        @blur="sBlur"
        @keypress.enter="onSubmit"
      />
      <small v-if="sError || myError">{{ sError || myError }}</small>

      <div class="control">
        <div class="control__left">
          <button
            :class="['clear', {'clear_active': searchFull}]"
            @click="resetForm"
            :disabled="!searchFull"
          >
            clear
          </button>
        </div>
        <div class="control__right">
          <div class="cancel cancel_active" @click="cancel">cancel</div>
          <button type="submit" :class="['add', {'add_active': !isSubmitting}]" :disabled="isSubmitting">add</button>
        </div>
      </div>
    </form>
  </template>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

export default {
  emits: ['added'],
  setup (_, { emit }) {
    const store = useStore()
    const isActive = ref(false)
    const myError = ref('')
    const { handleSubmit, isSubmitting, resetForm } = useForm()
    const { value: search, errorMessage: sError, handleBlur: sBlur } = useField(
      'search',
      yup
        .string()
        .trim()
        .required('Choose a city')
    )

    const searchFull = computed(() => search.value)
    const cancel = () => {
      isActive.value = false
      resetForm()
    }
    const onSubmit = handleSubmit(async value => {
      const checking = store.getters.extraWeather.filter(key => key.city === value.search)

      try {
        if (checking.length) {
          throw new Error('This city already exists')
        }
        const newCity = await store.dispatch('addCity', value)
        emit('added', newCity)
        cancel()
      } catch (e) {
        myError.value = e.message
        setTimeout(() => {
          myError.value = ''
        }, 2500)
      }
    })

    return {
      isActive,
      search,
      sError,
      sBlur,
      onSubmit,
      isSubmitting,
      resetForm,
      searchFull,
      cancel,
      myError
    }
  }
}
</script>
