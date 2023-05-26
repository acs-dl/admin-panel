<template>
  <div :class="selectFieldClasses">
    <div ref="selectElement" class="select-field__select-wrp">
      <div class="select-field__select-head-wrp">
        <template v-if="$slots.head">
          <slot
            name="head"
            :select-field="{
              select,
              chosenLabel: chosenLabel,
              isOpen: isDropdownOpen,
              toggle: toggleDropdown,
            }"
          />
        </template>
        <button
          v-else
          type="button"
          class="select-field__select-head"
          @click="toggleDropdown"
        >
          <template v-if="isModelValueExist">
            {{ modelValue }}
          </template>
          <template v-else-if="!label">
            <span class="select-field__placeholder">
              {{ props.placeholder }}
            </span>
          </template>
          <icon
            :class="[
              'select-field__select-head-indicator',
              {
                'select-field__select-head-indicator--open': isDropdownOpen,
              },
            ]"
            :name="$icons.chevronDown"
          />
        </button>
        <label
          v-if="label"
          class="select-field__label"
          :for="`select-field--${uid}`"
        >
          {{ label }}
        </label>
      </div>
      <transition name="select-field__select-dropdown">
        <div v-if="isDropdownOpen" class="select-field__select-dropdown">
          <template v-if="$slots.default">
            <slot
              :select-field="{
                select,
                chosenLabel: chosenLabel,
                isOpen: isDropdownOpen,
                toggle: toggleDropdown,
              }"
            />
          </template>
          <template v-else-if="valueOptions.length">
            <button
              :class="[
                'select-field__select-dropdown-item',
                {
                  'select-field__select-dropdown-item--active':
                    modelValue === (option?.value ?? option),
                },
              ]"
              type="button"
              v-for="(option, idx) in valueOptions"
              :key="`[${idx}] ${option}`"
              @click="select(option)"
            >
              {{ option?.label ?? option }}
            </button>
          </template>
        </div>
      </transition>
    </div>
    <transition
      name="select-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="select-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useRouter } from '@/router'
import { onClickOutside } from '@vueuse/core'
import { SelectFieldValue } from '@/types'

type SCHEMES = 'primary' | 'secondary'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
    modelValue: string | number
    valueOptions?: string[] | number[] | SelectFieldValue[]
    label?: string
    placeholder?: string
    errorMessage?: string
  }>(),
  {
    scheme: 'primary',
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const attrs = useAttrs()

const selectElement = ref<HTMLDivElement>()

const isDropdownOpen = ref(false)
const uid = getCurrentInstance()?.uid

const router = useRouter()

router.afterEach(() => {
  closeDropdown()
})

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const isModelValueExist = computed(
  () => Boolean(props.modelValue) || Number.isInteger(props.modelValue),
)

const chosenOption = computed(
  () =>
    props.valueOptions.find(
      item => item?.value === props.modelValue || item === props.modelValue,
    ) ?? '',
)

const chosenLabel = computed(
  () => chosenOption.value?.label ?? chosenOption.value,
)

const isLabelActive = computed(() => isDropdownOpen.value || !!props.modelValue)

const selectFieldClasses = computed(() => ({
  'select-field': true,
  'select-field--error': props.errorMessage,
  'select-field--open': isDropdownOpen.value,
  'select-field--disabled': isDisabled.value,
  'select-field--readonly': isReadonly.value,
  'select-field--label-active': isLabelActive.value,
  [`select-field--${props.scheme}`]: true,
}))

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const toggleDropdown = () => {
  if (isDisabled.value || isReadonly.value) return
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const select = (option: string | number | SelectFieldValue) => {
  if (isDisabled.value || isReadonly.value) return

  emit('update:modelValue', option?.value ?? option)
  toggleDropdown()
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropdown()
    })
  }
})

watch(
  () => props.modelValue,
  () => {
    closeDropdown()
  },
)
</script>

<style lang="scss" scoped>
$z-local-index: 2;

.select-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
    pointer-events: none;
  }
}

.select-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  position: absolute;
  padding: toRem(4);
  top: 50%;
  left: var(--field-padding-left);
  transform: translateY(-50%);
  color: var(--field-label);
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.3;
  background: var(--field-bg-primary);

  @include field-label;

  transition-property: all;

  .select-field--secondary & {
    background: none;
    padding: 0;
  }

  .select-field--error & {
    color: var(--field-error);
  }

  .select-field--label-active & {
    top: 0;
    font-size: toRem(12);
    line-height: 1.3;
    font-weight: 700;
  }

  .select-field--open & {
    color: var(--primary-main);
  }

  .select-field--label-active.select-field--secondary & {
    transform: translateY(50%);
  }
}

.select-field__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-field__select-head-wrp {
  position: relative;
  width: 100%;
  height: 100%;
}

.select-field__select-head {
  display: flex;
  background: var(--field-bg-primary);
  padding: var(--field-padding);
  padding-right: calc(var(--field-padding-right) + #{toRem(24)});
  text-align: left;
  width: 100%;
  height: 100%;

  $field-text-height: calc(
    var(--field-text-font-size) * var(--field-text-line-height)
  );

  min-height: calc(
    $field-text-height + var(--field-padding-top) + var(--field-padding-bottom)
  );

  @include field-text;

  transition-property: all;

  .select-field--primary & {
    @include field-border;
  }

  .select-field--secondary & {
    position: relative;
    background: var(--field-bg-secondary);
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-secondary);
    padding: var(--field-padding-top) var(--field-padding-right)
      var(--field-padding-bottom) var(--field-padding-left);
    border: toRem(1) solid var(--field-border);
    border-radius: toRem(10);
  }

  .select-field--error.select-field--primary & {
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary),
      0 0 0 toRem(1) var(--field-error);
    border-color: var(--field-error);
  }

  .select-field--error.select-field--secondary & {
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-secondary);
    border-color: var(--field-error);
  }

  .select-field--open.select-field--primary & {
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary),
      0 0 0 toRem(2) var(--primary-main);
    border-color: var(--primary-main);
  }
}

.select-field__placeholder {
  font: inherit;

  @include field-placeholder;
}

.select-field__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: var(--field-padding-right);
  transform: translateY(-50%);
  transition: transform 0.1s ease-in-out;
  width: toRem(18);
  height: toRem(18);
  color: var(--field-text);

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }
}

.select-field__select-dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden auto;
  top: 105%;
  right: 50%;
  transform: translateX(50%);
  width: 100%;
  max-height: 500%;
  z-index: $z-local-index;
  background: var(--background-secondary-main);
  box-shadow: 0 toRem(1) toRem(2) rgba(var(--black-rgb), 0.3),
    0 toRem(2) toRem(6) toRem(2) rgba(var(--black-rgb), 0.15);
  border-radius: toRem(8);

  .select-field--secondary & {
    background: var(--field-bg-secondary);
    max-height: 250%;
  }
}

.select-field__select-dropdown-enter-active {
  animation: dropdown var(--field-transition-duration);
}

.select-field__select-dropdown-leave-active {
  animation: dropdown var(--field-transition-duration) 0.1s reverse;
}

@keyframes dropdown {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.select-field__select-dropdown-item {
  font-size: toRem(16);
  font-weight: 400;
  text-align: left;
  width: 100%;
  padding: toRem(8) var(--field-padding-right) toRem(8)
    var(--field-padding-left);
  transition: background 0.2s ease-in-out;

  &:hover {
    background: var(--background-primary-dark);
  }

  &--active {
    background: var(--background-tertiary-main);
  }
}

.select-field__err-msg {
  @include field-error;
}

.select-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.select-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-msg-height);
  }
}
</style>
