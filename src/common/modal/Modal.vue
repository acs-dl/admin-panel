<template>
  <div class="modal">
    <button
      class="modal__backdrop"
      @click="isCloseByClickOutside ? closeModal : ''"
    />
    <div class="modal__pane" ref="modalPane">
      <div v-if="isWithCancelBtn" class="modal__pane-header">
        <app-button
          class="modal__pane-header-close-btn"
          :icon-right="$icons.cross"
          @click="closeModal"
        />
      </div>
      <slot :modal="{ close: closeModal }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AppButton } from '@/common'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'click-outside', payload: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown?: boolean
    isCenter?: boolean
    isWithCancelBtn?: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isShown: false,
    withCancelBtn: false,
    isCenter: false,
    isCloseByClickOutside: false,
  },
)

const modalPane = ref<HTMLElement | undefined>()

onMounted(() => {
  if (modalPane.value) {
    if (props.isCloseByClickOutside) {
      onClickOutside(modalPane, () => {
        closeModal()
      })
    }
  }
})

const closeModal = () => {
  emit('click-outside', false)
}
</script>

<style scoped lang="scss">
$z-modal-local-backdrop: -1;
$z-modal: 10;

.modal {
  position: fixed;
  width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  z-index: $z-modal;
  background: transparent;
}

.modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: $z-modal-local-backdrop;
  background: rgba(var(--black-rgb), 0.5);
}

.modal__pane {
  display: flex;
  position: fixed;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  background: var(--background-secondary-main);
  padding: toRem(24);
  border-radius: toRem(10);
  min-width: toRem(300);

  @include respond-to(small) {
    left: var(--app-padding-left);
    right: var(--app-padding-right);
    transform: translateY(-50%);
    padding: var(--app-padding-right);
    max-width: none;
  }
}

.modal__pane-header {
  display: flex;
  justify-content: flex-end;
  padding: toRem(14);
}

.modal__pane-header-close-btn {
  font-size: toRem(20);
  color: var(--text-gray);
}
</style>
