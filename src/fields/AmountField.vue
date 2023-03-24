<script lang="ts" setup>
import { InputField } from '@/fields'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    decimals?: number
    placeholder?: string
    label?: string
    errorMessage?: string
    isInteger?: boolean
  }>(),
  {
    modelValue: '',
    decimals: 2,
    placeholder: '',
    label: '',
    errorMessage: '',
    isInteger: false,
  },
)

const amount = ref(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const input = () => {
  amount.value = normalizeNumber(amount.value)
  emit('update:modelValue', amount.value)
}

const normalizeNumber = (amount: string) => {
  return props.isInteger ? normalizeInteger(amount) : normalizeAmount(amount)
}

function normalizeAmount(value: string): string {
  const formatValue = value.replace(/,/, '.')
  const normalizedValue = formatValue.match(
    `\\d*\\.?\\d{0,${props.decimals}}`,
  )?.[0]

  return normalizedValue === '.' ? '0.' : normalizedValue || ''
}

function normalizeInteger(value: string): string {
  return value.match(/^(-)?(\d+)?/)?.[0] || ''
}
</script>

<template>
  <input-field
    v-model="amount"
    v-bind="$attrs"
    :placeholder="placeholder"
    :label="label"
    :error-message="errorMessage"
    @input="input"
  >
    <template v-if="$slots.nodeLeft" #nodeLeft>
      <slot name="nodeLeft" />
    </template>
  </input-field>
</template>
