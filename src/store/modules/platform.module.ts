import { defineStore } from 'pinia'
import { api } from '@/api'
import { PositionsResponse, ModuleBaseInfo } from '@/types'

export const usePlatformStore = defineStore('platform', {
  state: () => ({
    positions: [] as string[],
    modules: [] as ModuleBaseInfo[],
  }),
  actions: {
    async getAllPositions(): Promise<void> {
      const { data } = await api.get<PositionsResponse>(
        '/integrations/identity-svc/users/positions',
      )
      this.positions = data.positions
    },

    async getAllModules(): Promise<void> {
      const { data } = await api.get<ModuleBaseInfo[]>(
        '/integrations/orchestrator/modules',
      )
      this.modules = data
    },
  },
})
