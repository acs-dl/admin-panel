<template>
  <transition name="modal">
    <modal
      v-if="isShown"
      v-bind="$attrs"
      :is-close-by-click-outside="isCloseByClickOutside"
      :is-with-cancel-btn="isWithCancelBtn"
      :is-center="isCenter"
      @click-outside="closeModal"
    >
      <slot :modal="{ close: closeModal }" />
    </modal>
  </transition>
</template>

<script lang="ts" setup>
import Modal from './Modal.vue'

const emit = defineEmits<{
  (e: 'click-outside', payload: boolean): void
}>()

withDefaults(
  defineProps<{
    isShown?: boolean
    isCenter?: boolean
    isWithCancelBtn?: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isShown: true,
    withCancelBtn: false,
    isCenter: true,
    isCloseByClickOutside: true,
  },
)

const closeModal = () => {
  emit('click-outside', false)
}
</script>

<style scoped lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
