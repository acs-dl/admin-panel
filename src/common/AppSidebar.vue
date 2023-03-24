<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <app-logo class="sidebar__logo" />
      <h2 class="sidebar__title">
        {{ $t('sidebar.main-title') }}
      </h2>
    </div>
    <ul class="sidebar__links-list">
      <li class="sidebar__link-item">
        <router-link
          class="sidebar__link"
          :to="{ name: $routes.verifiedUsers }"
        >
          <icon :name="$icons.verifiedUsers" class="sidebar__link-icon" />
          <span class="sidebar__link-text">
            {{ $t('sidebar.verified-users-link') }}
          </span>
        </router-link>
      </li>
      <li class="sidebar__link-item">
        <router-link
          class="sidebar__link"
          :to="{ name: $routes.unverifiedUsers }"
        >
          <icon :name="$icons.unverifiedUsers" class="sidebar__link-icon" />
          <span class="sidebar__link-text">
            {{ $t('sidebar.unverified-users-link') }}
          </span>
          <div
            v-if="unverifiedUsersCount"
            class="sidebar__link-unverified-users-count"
          >
            {{ unverifiedUsersCount }}
          </div>
        </router-link>
      </li>
    </ul>
    <div class="sidebar__footer">
      <div
        v-if="adminInfo?.name && adminInfo?.surname && accessToken?.email"
        class="sidebar__user"
      >
        <div class="sidebar__user-logo">
          <div>
            {{ adminInfo.name[0].toUpperCase() }}
          </div>
        </div>
        <div class="sidebar__user-info">
          <div class="sidebar__user-info-name">
            {{ `${adminInfo.name} ${adminInfo.surname}` }}
          </div>
          <div class="sidebar__user-info-email" :title="accessToken.email">
            {{ accessToken.email }}
          </div>
        </div>
      </div>
      <app-button
        class="sidebar__logout-btn"
        color="default"
        scheme="default"
        size="default"
        :icon-left="$icons.logout"
        @click="logout"
      />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppLogo, Icon, AppButton } from '@/common'
import { useAuthStore } from '@/store'
import { UnverifiedModuleUser, VerifiedUser } from '@/types'
import { api } from '@/api'
import { ErrorHandler } from '@/helpers'

const { logout, accessToken } = useAuthStore()
const unverifiedUsersCount = ref(0)
const adminInfo = ref<VerifiedUser | null>(null)

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

const init = async () => {
  await Promise.allSettled([getUnverifiedUsersCount(), getAdminInfo()])
}

init()
</script>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: toRem(32);
  background: var(--app-bg-tertiary);
  box-sizing: border-box;
}

.sidebar__logo {
  margin-bottom: toRem(40);
}

.sidebar__title {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
  font-size: toRem(14);
  margin-bottom: toRem(14);
  color: var(--text-primary-light);
}

.sidebar__links-list {
  display: flex;
  flex-direction: column;
  row-gap: toRem(8);
  flex: 1;
}

.sidebar__link {
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

.sidebar__link-icon {
  width: toRem(16);
  height: toRem(16);
}

.sidebar__link-unverified-users-count {
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

.sidebar__link-text {
  font-weight: 500;
  font-size: toRem(14);
}

.sidebar__footer,
.sidebar__user {
  display: flex;
  align-items: center;
  gap: toRem(10);
  width: 100%;
}

.sidebar__user-logo {
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

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  font-size: toRem(14);
  max-width: toRem(150);
}

.sidebar__user-info-name,
.sidebar__user-info-email {
  @include text-ellipsis;
}

.sidebar__user-info-name {
  font-size: toRem(16);
  line-height: 1.4;
}

.sidebar__user-info-email {
  font-size: toRem(14);
  color: var(--text-primary-light);
  line-height: 1.2;
}

.sidebar__logout-btn {
  font-size: toRem(24);
  color: var(--text-primary-light);
}
</style>
