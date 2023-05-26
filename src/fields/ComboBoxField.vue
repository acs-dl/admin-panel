<template>
  <div class="combo-box-field" ref="rootEl">
    <input-field
      v-model="searchValue"
      v-bind="$attrs"
      class="combo-box-field__search"
      autocomplete="off"
      :placeholder="placeholder"
      :label="label"
      @focus="toggleDropdown"
    />
    <transition name="combo-box-field">
      <div v-if="isDropdownOpened" class="combo-box-field__inner">
        <template v-if="isLoadFailed">
          <div class="combo-box-field__message">
            {{ $t('combo-box-field.error-message') }}
          </div>
        </template>
        <template v-else>
          <template v-if="pickOptions.length">
            <div class="combo-box-field__list">
              <button
                v-for="item in pickOptions"
                class="combo-box-field__list-item"
                type="button"
                :key="item.id"
                :class="`combo-box-field__list-item--${dropdownScheme}`"
                @click="selectCurrentOption(item)"
              >
                <img
                  v-if="item.image"
                  class="combo-box-field__list-item-image"
                  :src="item.image"
                  :alt="item.text"
                />
                <icon
                  v-else-if="Number.isInteger(item.followersCount)"
                  class="combo-box-field__list-item-image"
                  :name="$icons.ban"
                />
                <span class="combo-box-field__list-item-text">
                  {{ item.text }}
                </span>
                <span
                  v-if="Number.isInteger(item.followersCount)"
                  class="combo-box-field__list-second-item-text"
                >
                  {{
                    $t('combo-box-field.followers-count', {
                      count: item.followersCount,
                    })
                  }}
                </span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="combo-box-field__message">
              {{ $t('combo-box-field.empty-message') }}
            </div>
          </template>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { InputField } from '@/fields'
import { onClickOutside } from '@vueuse/core'
import { InputDropdownPickOption } from '@/types'
import { Icon } from '@/common'
import { debounce } from 'lodash-es'
import { DEBOUNCE_DEFAULT_TIMEOUT } from '@/consts'
import { ErrorHandler } from '@/helpers'

type LoadPickOptions = (
  searchValue: string,
) => Promise<InputDropdownPickOption[]>

type SCHEMES = 'default' | 'secondary'

// TODO: modelValue generic

const props = withDefaults(
  defineProps<{
    loadPickOptions: LoadPickOptions
    placeholder?: string
    label?: string
    dropdownScheme?: SCHEMES
    modelValue?: number | string
  }>(),
  {
    label: '',
    placeholder: '',
    dropdownScheme: 'default',
    modelValue: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const searchValue = ref('')
const pickOptions = ref<InputDropdownPickOption[]>([])
const rootEl = ref<HTMLElement | null>(null)
const isDropdownOpened = ref(false)
const isLoadFailed = ref(false)
const isLoaded = ref(true)

const toggleDropdown = () => {
  isDropdownOpened.value = !isDropdownOpened.value
}

const closeDropdown = () => {
  isDropdownOpened.value = false
}

const loadOptions = async () => {
  isLoadFailed.value = false
  isLoaded.value = false
  try {
    pickOptions.value = await props.loadPickOptions(searchValue.value)
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

const debouncedLoadOptions = debounce(loadOptions, DEBOUNCE_DEFAULT_TIMEOUT)

const selectCurrentOption = (option: InputDropdownPickOption) => {
  toggleDropdown()
  searchValue.value = option.text
  emit('update:modelValue', option.id)
}

watch(searchValue, debouncedLoadOptions, { immediate: true })

onMounted(() => {
  if (rootEl.value) {
    onClickOutside(rootEl, () => {
      if (isDropdownOpened.value) closeDropdown()
    })
  }
})
</script>

<style lang="scss" scoped>
$custom-z-index: 10;

.combo-box-field {
  position: relative;
}

.combo-box-field__inner {
  position: absolute;
  left: 0;
  width: 100%;
  max-height: toRem(90);
  z-index: $custom-z-index;
  background: var(--white);
  margin-top: toRem(5);
  overflow-y: scroll;
  box-shadow: 0 toRem(1) toRem(2) rgba(var(--black-rgb), 0.3),
    0 toRem(2) toRem(6) toRem(2) rgba(var(--black-rgb), 0.15);
  border-radius: toRem(8);
}

.combo-box-field__list-item,
.combo-box-field__message {
  padding: toRem(12) var(--field-padding-right) toRem(12)
    var(--field-padding-left);
  font-weight: 400;
  line-height: 1;
  font-size: toRem(16);
  text-align: left;
  width: 100%;
}

.combo-box-field__list-item {
  font-size: toRem(16);
  font-weight: 400;
  text-align: left;
  width: 100%;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: var(--background-primary-dark);
  }

  &--secondary {
    display: grid;
    grid-template-columns: toRem(30) minmax(toRem(100), 1fr);
    gap: toRem(5) toRem(10);
    align-items: center;
  }
}

.combo-box-field__list-item-image {
  grid-column: 1;
  grid-row: 1 / span 2;
  max-width: toRem(30);
  max-height: toRem(30);
}

.combo-box-field__list-item-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(5);
}

.combo-box-field__list-second-item-text {
  font-size: toRem(12);
  color: var(--text-primary-light);
}

.combo-box-field-enter-active,
.combo-box-field-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.combo-box-field-enter-from,
.combo-box-field-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
