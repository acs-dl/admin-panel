<template>
  <transition name="tooltip">
    <div v-if="isShown" class="app-tooltip">
      <icon class="app-tooltip__triangle" :name="$icons.triangle" />
      <div class="app-tooltip__message-wrapper">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

defineProps<{
  message: string
  isShown: boolean
}>()
</script>

<style lang="scss" scoped>
$custom-z-index: 1;

.app-tooltip {
  z-index: $custom-z-index;
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  height: toRem(150);
  top: calc(100% - #{toRem(35)});
  left: 50%;
  transform: translateX(-50%);
}

.app-tooltip__message-wrapper {
  padding: toRem(12);
  border-radius: toRem(8);
  width: toRem(200);
  word-break: break-word;
  max-height: toRem(100);
  overflow-y: auto;
  background: var(--black);
  color: var(--text-primary-invert-main);
}

.app-tooltip__triangle {
  z-index: $custom-z-index;
  width: toRem(16);
  height: toRem(10);
  transform: translateY(#{toRem(2)});
  color: var(--black);
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: 0.25s ease;
  transition-property: opacity;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
