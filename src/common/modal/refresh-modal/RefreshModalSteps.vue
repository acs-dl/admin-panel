<template>
  <div class="refresh-modal-steps">
    <app-button
      v-for="(step, idx) in refreshSteps"
      :key="idx"
      class="refresh-modal-steps__step"
      :class="{
        'refresh-modal-steps__step--active': step.name === currentStep,
      }"
      :text="step.text"
      :icon-right="getIconNameByStep(step.name)"
      @click="chooseStep(step.name)"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { computed } from 'vue'
import { ICON_NAMES, REFRESH_MODULE_STEPS } from '@/enums'
import { useContext } from '@/composables'

const props = defineProps<{
  currentStep: REFRESH_MODULE_STEPS
}>()

const emit = defineEmits<{
  (e: 'update:currentStep', value: REFRESH_MODULE_STEPS): void
}>()

const { $t } = useContext()

const refreshSteps = computed(() => [
  {
    name: REFRESH_MODULE_STEPS.all,
    text: $t('refresh-modal-steps.refresh-all'),
  },
  {
    name: REFRESH_MODULE_STEPS.module,
    text: $t('refresh-modal-steps.refresh-module'),
  },
  {
    name: REFRESH_MODULE_STEPS.submodule,
    text: $t('refresh-modal-steps.refresh-submodule'),
  },
])

const getIconNameByStep = (step: string) =>
  step === props.currentStep
    ? ICON_NAMES.boldCheckCircle
    : ICON_NAMES.emptyCircle

const chooseStep = (stepForEditing: REFRESH_MODULE_STEPS) => {
  emit('update:currentStep', stepForEditing)
}
</script>

<style lang="scss" scoped>
.refresh-modal-steps {
  display: flex;
  gap: toRem(12);
  min-width: toRem(625);
  justify-content: center;

  @include respond-to(tablet) {
    flex-direction: column;
    min-width: auto;
    width: 100%;
  }
}

.refresh-modal-steps__step {
  flex: 1;
  max-width: toRem(200);
  padding: toRem(16);
  border-radius: toRem(12);
  border: toRem(1) solid var(--border-primary-light);
  font-weight: 500;
  font-size: toRem(14);
  text-align: left;
  transition: all 0.2s ease-in-out;
  justify-content: space-between;

  &:deep(.app-button__icon-right) {
    max-width: toRem(16);
    max-height: toRem(16);
  }

  &:not([disabled]):active,
  &:not([disabled]):hover,
  &:not([disabled]):focus {
    border: toRem(1) solid var(--border-primary-light);
  }

  &--active {
    border: toRem(1) solid var(--primary-main);
    background: var(--background-tertiary-light);

    &:deep(.app-button__icon-right) {
      color: var(--white);
    }

    &:not([disabled]):active,
    &:not([disabled]):hover,
    &:not([disabled]):focus {
      border: toRem(1) solid var(--primary-main);
      background: var(--background-tertiary-light);
    }
  }

  @include respond-to(tablet) {
    width: 100%;
    max-width: 100%;
  }
}
</style>
