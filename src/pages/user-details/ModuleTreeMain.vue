<template>
  <ul class="module-item__wrapper">
    <li class="module-item">
      <app-button color="default" class="module-item__name" @click="toggle">
        <span class="module-item__name-text">
          {{ module.type }}
        </span>
        <icon
          class="module-item__name-icon"
          :class="{ 'module-item__name-icon--open': isOpen }"
          :name="$icons.chevronFullRight"
        />
      </app-button>

      <div>
        <span v-if="!isOpen">
          {{ $t('module-item.submodule-column') }}
        </span>
      </div>
      <div>
        <span v-if="!isOpen">
          {{ $t('module-item.access-level-column') }}
        </span>
      </div>
      <app-button
        class="module-item__item-btn"
        color="error"
        :text="$t('module-item.delete-btn')"
        @click="toggleRemoveModal"
      />
    </li>
    <ul v-if="isOpen" class="module-item__children">
      <module-trees-item
        v-for="(child, index) in module.children"
        class="module-item__children-item"
        :key="index"
        :id="module.id"
        :module-name="module.type"
        :item="child"
      />
    </ul>
    <delete-modal
      v-if="isOpenRemoveModal"
      :icon="$icons.trash"
      @cancel="toggleRemoveModal"
      @delete="deleteUserFromModule"
    />
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, Icon, DeleteModal } from '@/common'
import { ModuleTree } from '@/types'
import ModuleTreesItem from './ModuleTreesItem.vue'
import { api } from '@/api'
import { ErrorHandler, Bus } from '@/helpers'
import { useContext } from '@/composables'

const props = defineProps<{
  module: ModuleTree
}>()

const { $t } = useContext()
const isOpenRemoveModal = ref(false)
const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const toggleRemoveModal = () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const deleteUserFromModule = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: props.module.type,
          payload: {
            action: 'delete_user',
            user_id: String(props.module.id),
            username: props.module.children[0]?.username,
          },
        },
        relationships: {
          user: {
            data: {
              id: '1',
            },
          },
        },
      },
    })
    Bus.success($t('module-info-item.success-delete'))
    isOpenRemoveModal.value = false
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style scoped lang="scss">
.module-item__wrapper {
  padding-left: 0.5em;
  line-height: 1.5em;
}

.module-item {
  display: grid;
  grid-template-columns:
    toRem(100)
    minmax(toRem(100), 1fr)
    minmax(toRem(100), toRem(150))
    toRem(100);
  gap: toRem(10);
}

.module-item__name {
  align-items: center;
  gap: toRem(4);
}

.module-item__name-text {
  font-weight: 400;
}

.module-item__name-icon {
  width: toRem(8);
  height: toRem(8);
  transition: linear 0.1s;

  &--open {
    transform: rotate(90deg);
  }
}

.module-item__children {
  margin-left: toRem(110);
}

.module-item__children-item {
  padding-left: 0;

  &:last-child:before {
    border-left: none;
  }
}

.module-item__item-btn {
  font-weight: 400;
}
</style>
