<template>
  <div class="user-input-dropdown-field" ref="rootEl">
    <input-field
      :model-value="searchValue"
      v-bind="$attrs"
      class="user-input-dropdown-field__search"
      autocomplete="off"
      :placeholder="placeholder"
      :label="label"
      @update:model-value="search"
      @focus="toggleDropdown"
    />
    <transition name="user-input-dropdown-field">
      <div v-if="isDropdownOpened" class="user-input-dropdown-field__inner">
        <template v-if="isLoadFailed">
          <div class="user-input-dropdown-field__message">
            {{ $t('user-input-dropdown-field.error-message') }}
          </div>
        </template>
        <template v-else>
          <template v-if="pickOptions.length">
            <div class="user-input-dropdown-field__list">
              <button
                v-for="item in pickOptions"
                class="user-input-dropdown-field__list-item"
                type="button"
                :key="item.id"
                :class="[
                  `user-input-dropdown-field__list-item--${dropdownScheme}`,
                ]"
                @click="selectCurrentUser(item)"
              >
                <!--TODO: REMOVE-->
                <img
                  v-if="item.image"
                  class="user-input-dropdown-field__list-item-image"
                  :src="item.image"
                  :alt="item.text"
                />
                <icon
                  v-else-if="Number.isInteger(item.followersCount)"
                  class="user-input-dropdown-field__list-item-image"
                  :name="$icons.ban"
                />
                <span class="user-input-dropdown-field__list-item-text">
                  {{ item.text }}
                </span>
                <span
                  v-if="Number.isInteger(item.followersCount)"
                  class="user-input-dropdown-field__list-second-item-text"
                >
                  {{
                    $t('user-input-dropdown-field.followers-count', {
                      count: item.followersCount,
                    })
                  }}
                </span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="user-input-dropdown-field__message">
              {{ $t('user-input-dropdown-field.empty-message') }}
            </div>
          </template>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { InputField } from '@/fields'
import { onClickOutside } from '@vueuse/core'
import { InputDropdownPickOption } from '@/types'
import { Icon } from '@/common'

type SCHEMES = 'default' | 'secondary'

withDefaults(
  defineProps<{
    modelValue: number
    searchValue: string
    isLoadFailed: boolean
    isLoaded: boolean
    pickOptions: InputDropdownPickOption[]
    placeholder?: string
    label?: string
    dropdownScheme?: SCHEMES
  }>(),
  {
    label: '',
    placeholder: '',
    dropdownScheme: 'default',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update:searchValue', value: string): void
}>()

const rootEl = ref<HTMLElement | null>(null)
const isDropdownOpened = ref(false)

const toggleDropdown = () => {
  isDropdownOpened.value = !isDropdownOpened.value
}

const closeDropdown = () => {
  isDropdownOpened.value = false
}

onMounted(async () => {
  if (rootEl.value) {
    onClickOutside(rootEl, () => {
      if (isDropdownOpened.value) closeDropdown()
    })
  }
})

const search = (searchValue: string) => {
  emit('update:searchValue', searchValue)
}

const selectCurrentUser = (currentUser: InputDropdownPickOption) => {
  toggleDropdown()
  emit('update:modelValue', currentUser.id)
  emit('update:searchValue', currentUser.text)
}
</script>

<style lang="scss" scoped>
$custom-z-index: 10;

.user-input-dropdown-field {
  position: relative;
}

.user-input-dropdown-field__inner {
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

.user-input-dropdown-field__list-item,
.user-input-dropdown-field__message {
  padding: toRem(12) var(--field-padding-right) toRem(12)
    var(--field-padding-left);
  font-weight: 400;
  line-height: 1;
  font-size: toRem(16);
  text-align: left;
  width: 100%;
}

.user-input-dropdown-field__list-item {
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

.user-input-dropdown-field__list-item-image {
  grid-column: 1;
  grid-row: 1 / span 2;
  max-width: toRem(30);
  max-height: toRem(30);
}

.user-input-dropdown-field__list-item-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(5);
}

.user-input-dropdown-field__list-second-item-text {
  font-size: toRem(12);
  color: var(--text-primary-light);
}

.user-input-dropdown-field-enter-active,
.user-input-dropdown-field-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.user-input-dropdown-field-enter-from,
.user-input-dropdown-field-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
