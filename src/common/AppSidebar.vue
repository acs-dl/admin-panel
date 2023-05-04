<template>
  <transition name="app-sidebar__transition">
    <div v-if="isSidebarShown" class="app-sidebar">
      <aside ref="asideElement" class="app-sidebar__aside">
        <div class="app-sidebar__header">
          <div class="app-sidebar__logo-wrapper">
            <app-logo class="app-sidebar__logo" />
            <app-button
              class="app-sidebar__close-button"
              :icon-left="$icons.x"
              @click="toggleSidebar"
            />
          </div>
          <h2 class="app-sidebar__title">
            {{ $t('app-sidebar.employee-title') }}
          </h2>
        </div>
        <div class="app-sidebar__actions">
          <ul class="app-sidebar__links-list">
            <li class="app-sidebar__link-item">
              <router-link
                class="app-sidebar__action"
                :to="{ name: $routes.verifiedUsers }"
                @click="toggleSidebar"
              >
                <icon
                  :name="$icons.verifiedUsers"
                  class="app-sidebar__action-icon"
                />
                <span class="app-sidebar__action-text">
                  {{ $t('app-sidebar.verified-users-link') }}
                </span>
              </router-link>
            </li>
            <li class="app-sidebar__action-item">
              <router-link
                class="app-sidebar__action"
                :to="{ name: $routes.unverifiedUsers }"
                @click="toggleSidebar"
              >
                <icon
                  :name="$icons.unverifiedUsers"
                  class="app-sidebar__action-icon"
                />
                <span class="app-sidebar__action-text">
                  {{ $t('app-sidebar.unverified-users-link') }}
                </span>
                <div
                  v-if="unverifiedUsersCount"
                  class="app-sidebar__action-unverified-users-count"
                >
                  {{ unverifiedUsersCount }}
                </div>
              </router-link>
            </li>
          </ul>
          <div class="app-sidebar__tools">
            <div class="app-sidebar__header">
              <h2 class="app-sidebar__title">
                {{ $t('app-sidebar.tools-title') }}
              </h2>
            </div>
            <ul class="app-sidebar__links-list">
              <li class="app-sidebar__action-item">
                <app-button
                  class="app-sidebar__action app-sidebar__tool"
                  modification="border-rounded"
                  size="small"
                  @click="openStatusModal"
                  @mouseenter="toggleStatusButtonAnimation"
                  @mouseleave="toggleStatusButtonAnimation"
                >
                  <img
                    v-if="actionButtonsHoverState.isMouseOverTheStatusButton"
                    class="app-sidebar__action-icon"
                    src="@/assets/gifs/view-filled-grid-add-animated.gif"
                    :alt="$t('app-sidebar.alt-for-action-button-icon')"
                  />
                  <icon
                    v-else
                    class="app-sidebar__action-icon"
                    :name="$icons.viewFilledGridAdd"
                  />
                  <span class="app-sidebar__action-text">
                    {{ $t('app-sidebar.status-button') }}
                  </span>
                </app-button>
              </li>
              <li class="app-sidebar__action-item">
                <app-button
                  class="app-sidebar__action app-sidebar__tool"
                  modification="border-rounded"
                  size="small"
                  @click="openRefreshModal"
                  @mouseenter="toggleRefreshButtonAnimation"
                  @mouseleave="toggleRefreshButtonAnimation"
                >
                  <img
                    v-if="actionButtonsHoverState.isMouseOverTheRefreshButton"
                    class="app-sidebar__action-icon"
                    src="@/assets/gifs/refresh-animated.gif"
                    :alt="$t('app-sidebar.alt-for-action-button-icon')"
                  />
                  <icon
                    v-else
                    class="app-sidebar__action-icon"
                    :name="$icons.refresh"
                  />
                  <span class="app-sidebar__action-text">
                    {{ $t('app-sidebar.refresh-button') }}
                  </span>
                </app-button>
              </li>
            </ul>
          </div>
        </div>
        <div class="app-sidebar__footer">
          <div
            v-if="adminInfo?.name && adminInfo?.surname && accessToken.email"
            class="app-sidebar__user"
          >
            <div class="app-sidebar__user-logo">
              <div>
                {{ adminInfo?.name[0].toUpperCase() }}
              </div>
            </div>
            <div class="app-sidebar__user-info">
              <div class="app-sidebar__user-info-name">
                {{ `${adminInfo?.name} ${adminInfo?.surname}` }}
              </div>
              <div
                class="app-sidebar__user-info-email"
                :title="accessToken.email"
              >
                {{ accessToken.email }}
              </div>
            </div>
          </div>
          <app-button
            class="app-sidebar__logout-btn"
            color="default"
            scheme="default"
            size="default"
            :icon-left="$icons.logout"
            @click="platformLogout"
          />
        </div>
      </aside>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive } from 'vue'
import { AppLogo, Icon, AppButton } from '@/common'
import { useAuthStore } from '@/store'
import { UnverifiedModuleUser, VerifiedUser } from '@/types'
import { api } from '@/api'
import { ErrorHandler, Bus } from '@/helpers'
import {
  useWindowSize,
  useSwipe,
  SwipeDirection,
  onClickOutside,
} from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const emit = defineEmits<{
  (e: 'open-status-modal'): void
  (e: 'open-refresh-modal'): void
}>()

const swipe = useSwipe(document.querySelector('#app'))
const { width: windowWidth } = useWindowSize()
const { logout, accessToken } = useAuthStore()
const unverifiedUsersCount = ref(0)
const adminInfo = ref<VerifiedUser | null>(null)
const asideElement = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const actionButtonsHoverState = reactive({
  isMouseOverTheStatusButton: false,
  isMouseOverTheRefreshButton: false,
})

const isLessThanMediumScreen = computed(
  () => windowWidth.value <= WINDOW_BREAKPOINTS.medium,
)

const isSidebarShown = computed(
  () => !isLessThanMediumScreen.value || isVisible.value,
)

const toggleSidebar = () => {
  isVisible.value = !isVisible.value
}

const getUnverifiedUsersCount = async () => {
  try {
    const { meta } = await api.get<UnverifiedModuleUser[]>(
      '/integrations/unverified-svc/users',
    )
    unverifiedUsersCount.value = Number(meta?.total_count)
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const getAdminInfo = async () => {
  try {
    const { data } = await api.get<VerifiedUser>(
      `/integrations/identity-svc/users/${accessToken?.userId}`,
    )
    adminInfo.value = data
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const openStatusModal = () => {
  toggleSidebar()
  emit('open-status-modal')
}

const openRefreshModal = () => {
  toggleSidebar()
  emit('open-refresh-modal')
}

const toggleStatusButtonAnimation = () => {
  actionButtonsHoverState.isMouseOverTheStatusButton =
    !actionButtonsHoverState.isMouseOverTheStatusButton
}

const toggleRefreshButtonAnimation = () => {
  actionButtonsHoverState.isMouseOverTheRefreshButton =
    !actionButtonsHoverState.isMouseOverTheRefreshButton
}

const platformLogout = async () => {
  try {
    await logout()
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const init = async () => {
  await Promise.allSettled([getUnverifiedUsersCount(), getAdminInfo()])
}

Bus.on(Bus.eventList.toggleSidebar, toggleSidebar)

watch(asideElement, () => {
  if (!asideElement.value || !isLessThanMediumScreen.value || !isVisible.value)
    return

  onClickOutside(asideElement, toggleSidebar)
})

watch(swipe.direction, () => {
  switch (swipe.direction.value) {
    case SwipeDirection.RIGHT:
      isVisible.value = true
      break
    case SwipeDirection.LEFT:
      isVisible.value = false
      break
    default:
      break
  }
})

init()
</script>

<style scoped lang="scss">
$custom-z-index: 5;

.app-sidebar {
  width: 100%;
  max-width: toRem(256);
  height: 100vh;
  background: var(--app-bg-tertiary);

  @include respond-to(medium) {
    z-index: $custom-z-index;
    position: absolute;
    max-width: 100vw;
    width: 100%;
    background: rgba(var(--black-rgb), 0.5);
  }
}

.app-sidebar__aside {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: toRem(16);
  background: var(--app-bg);
  box-sizing: border-box;
  max-width: toRem(256);

  @include respond-to(tablet) {
    background: var(--app-bg);
    position: unset;
    max-width: toRem(256);
    border-radius: 0 toRem(6) toRem(6) 0;
  }

  @include respond-to(small) {
    max-width: toRem(256);
  }

  @include respond-to(xsmall) {
    max-width: 100%;
    border-radius: 0;
  }
}

.app-sidebar__title {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
  font-size: toRem(14);
  margin-bottom: toRem(14);
  color: var(--text-primary-light);
}

.app-sidebar__actions {
  display: flex;
  flex-direction: column;
  gap: toRem(60);
  flex: 1;
}

.app-sidebar__links-list {
  display: flex;
  flex-direction: column;
  row-gap: toRem(8);
}

.app-sidebar__action {
  display: flex;
  width: 100%;
  height: toRem(50);
  column-gap: toRem(15);
  align-items: center;
  padding: toRem(15) toRem(20);
  border-radius: toRem(15);
  color: var(--text-primary-main);

  &.router-link-active {
    background: var(--primary-light);
    color: var(--text-primary-main);
  }
}

.app-sidebar__action-icon {
  width: toRem(16);
  height: toRem(16);
}

.app-sidebar__action-unverified-users-count {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--primary-main);
  color: var(--white);
  padding: toRem(4) toRem(8);
  border-radius: toRem(20);
  font-size: toRem(10);
  max-height: toRem(18);
}

.app-sidebar__action-text {
  font-weight: 500;
  font-size: toRem(14);
}

.app-sidebar__footer,
.app-sidebar__user {
  display: flex;
  align-items: center;
  gap: toRem(10);
  width: 100%;
}

.app-sidebar__user-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 500;
  padding: toRem(16);
  font-size: toRem(16);
  max-width: toRem(42);
  max-height: toRem(42);
  width: 100%;
  height: 100%;
  background: var(--border-primary-main);
}

.app-sidebar__user-info {
  display: flex;
  flex-direction: column;
  font-size: toRem(14);
  max-width: toRem(135);
}

.app-sidebar__user-info-name,
.app-sidebar__user-info-email {
  @include text-ellipsis;
}

.app-sidebar__user-info-name {
  font-size: toRem(15);
  line-height: 1.4;
}

.app-sidebar__user-info-email {
  font-size: toRem(13);
  color: var(--text-primary-light);
  line-height: 1.2;
}

.app-sidebar__logout-btn {
  font-size: toRem(24);
  color: var(--text-primary-light);
}

.app-sidebar__tool {
  justify-content: flex-start;
  font-size: toRem(14);
  font-weight: 500;
}

.app-sidebar__logo-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(40);
}

.app-sidebar__close-button {
  display: none;
  color: var(--text-primary-main);

  @include respond-to(xsmall) {
    display: flex;
    width: toRem(24);
    height: toRem(24);
  }
}

.app-sidebar__transition-enter-active {
  animation: fade-unroll-right 0.5s ease-in-out;
}

.app-sidebar__transition-leave-active {
  animation: fade-unroll-right 0.5s ease-in-out reverse;
}

@keyframes fade-unroll-right {
  from {
    opacity: 0;
    width: 0;
  }

  to {
    opacity: 1;
    width: 100%;
  }
}
</style>
