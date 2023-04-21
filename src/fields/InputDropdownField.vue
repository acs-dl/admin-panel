<template>
  <div class="input-dropdown-field" ref="rootEl">
    <input-field
      v-model="searchValue"
      v-bind="$attrs"
      class="input-dropdown-field__search"
      autocomplete="off"
      :placeholder="placeholder"
      :label="label"
      @input="debounceSearchUsers"
      @focus="toggleDropdown"
    />
    <transition name="input-dropdown-field">
      <div v-if="isDropdownOpened" class="input-dropdown-field__inner">
        <template v-if="isLoadFailed">
          <div class="input-dropdown-field__message">
            {{ $t('input-dropdown-field.error-message') }}
          </div>
        </template>
        <template v-else>
          <template v-if="users.length">
            <div class="input-dropdown-field__inner-list">
              <button
                v-for="item in users"
                class="input-dropdown-field__inner-list-item"
                :key="item.id"
                type="button"
                @click="toggleCurrentUser(item)"
              >
                {{ `${item.name} ${item.surname}` }}
              </button>
            </div>
          </template>
          <template v-else>
            <div class="input-dropdown-field__message">
              {{ $t('input-dropdown-field.empty-message') }}
            </div>
          </template>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { InputField } from '@/fields'
import { api } from '@/api'
import { ErrorHandler } from '@/helpers'
import { onClickOutside } from '@vueuse/core'
import { VerifiedUser } from '@/types'
import debounce from 'lodash-es/debounce'

const props = withDefaults(
  defineProps<{
    modelValue: string
    user: VerifiedUser | null
    label?: string
    placeholder?: string
  }>(),
  {
    label: '',
    placeholder: ' ',
  },
)

const emit = defineEmits<{
  (e: 'update:user', value: VerifiedUser | null): void
  (e: 'update:modelValue', value: string): void
}>()

const rootEl = ref<HTMLElement | null>(null)

const users = ref<VerifiedUser[]>([])
const searchValue = ref(props.modelValue)

const isDropdownOpened = ref(false)
const isLoadFailed = ref(false)
const isLoaded = ref(false)

const loadUsers = async () => {
  try {
    const { data } = await api.get<VerifiedUser[]>(
      '/integrations/identity-svc/users',
      {
        filter: {
          ...(searchValue.value ? { search: searchValue.value } : {}),
        },
      },
    )
    users.value = data
  } catch (e) {
    isLoadFailed.value = false
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const toggleDropdown = () => {
  isDropdownOpened.value = !isDropdownOpened.value
}

const closeDropdown = () => {
  isDropdownOpened.value = false
}

const toggleCurrentUser = (selectedUser: VerifiedUser) => {
  if (props.user?.id !== selectedUser.id) {
    searchValue.value = `${selectedUser.name} ${selectedUser.surname}`
    emit('update:user', selectedUser)
  }
  closeDropdown()
}

const search = async () => {
  users.value = []
  isDropdownOpened.value = true
  await loadUsers()
}

const debounceSearchUsers = debounce(search, 200)

onMounted(async () => {
  if (rootEl.value) {
    onClickOutside(rootEl, () => {
      if (isDropdownOpened.value) closeDropdown()
    })
  }
  await loadUsers()
})

watch(
  () => searchValue.value,
  async () => {
    emit('update:modelValue', searchValue.value)
    if (!users.value.length) {
      emit('update:user', null)
    }
  },
)

watch(
  () => props.modelValue,
  () => {
    searchValue.value = props.modelValue
  },
)
</script>

<style lang="scss" scoped>
$custom-z-index: 1;

.input-dropdown-field {
  position: relative;
}

.input-dropdown-field__inner {
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

.input-dropdown-field-enter-active,
.input-dropdown-field-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.input-dropdown-field-enter-from,
.input-dropdown-field-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.input-dropdown-field__inner-list-item,
.input-dropdown-field__message {
  padding: toRem(12) var(--field-padding-right) toRem(12)
    var(--field-padding-left);
  font-weight: 400;
  line-height: 1;
  font-size: toRem(16);
  text-align: left;
  width: 100%;
}

.input-dropdown-field__inner-list-item {
  font-size: toRem(16);
  font-weight: 400;
  text-align: left;
  width: 100%;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: var(--background-primary-dark);
  }

  &--active {
    background: var(--background-tertiary-main);
  }
}
</style>
