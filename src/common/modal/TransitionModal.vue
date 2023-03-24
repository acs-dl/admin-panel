<template>
  <transition name="modal">
    <slot />
  </transition>
</template>

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
