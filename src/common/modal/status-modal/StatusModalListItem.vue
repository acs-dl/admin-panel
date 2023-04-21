<template>
  <div class="status-modal-list-item">
    <component :is="responseItem" :request="request" />
  </div>
</template>

<script lang="ts" setup>
import { UserRequest } from '@/types'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { StatusModalListDesktop, StatusModalListMobile } from '@/common'

defineProps<{
  request: UserRequest
}>()

const { width } = useWindowSize()

const responseItem = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.medium
    ? StatusModalListDesktop
    : StatusModalListMobile,
)
</script>
