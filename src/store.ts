/**
 * @file Global store
 * @author Surmon <https://github.com/surmon-china>
 */

// @ts-ignore
import { createStore, useStore as useVuexStore } from 'vuex'
import { GITHUB_REPOSITORIEL_IDS, GITHUB_UID } from '@/constants'
import * as http from '~/services/http'

export enum StoreNames {
  // mutations
  UpdateGuestState = 'updateGuestState',
  UpdateMobileState = 'updateMobileState',
  UpdateUserInfo = 'updateUserInfo',
  UpdateRepositories = 'updateRepositories',
  UpdateOrganizations = 'updateOrganizations',
  UpdateNPMPackages = 'updateNPMPackages',
  UpdateInitedState = 'updateInitedState',
  SetPackageDownloads = 'setPackageDownloads',
  // actions
  Init = 'init',
  GetUserInfo = 'getUserInfo',
  GetRepositories = 'getRepositories',
  GetOrganizations = 'getOrganizations',
  GetNPMPackages = 'getNPMPackages',
  GetPackageDownloads = 'getPackageDownloads',
  // getters
  OwnRepositories = 'ownRepositories',
  AppRepositories = 'appRepositories',
  NPMRepositories = 'npmRepositories',
  GetRepositorieDetail = 'getRepositorieDetail'
}

export type RootState = ReturnType<typeof state>
const state = () => ({
  isChinaGuest: false,
  isMobileDevice: false,
  userInfo: null as $TODO,
  repositories: [] as $TODO[],
  organizations: [] as $TODO[],
  npmPackages: [] as $TODO[],
  // TODO: 3.0
  // npmPackagesDownloadsMap: new Map<string, number>(),
  npmPackagesDownloadsMap: {} as { [key: string]: number },
  inited: false
})

const store =  createStore<RootState>({
  state,
  getters: {
    [StoreNames.OwnRepositories](state): $TODO[] {
      return state.repositories
        .filter((repositorie: $TODO) => !repositorie.fork)
        .sort((a: $TODO, b: $TODO) => b.stargazers_count - a.stargazers_count)
    },
    [StoreNames.AppRepositories](state) {
      const ids = Object.values(GITHUB_REPOSITORIEL_IDS)
      return state.repositories
      .filter((repositorie: $TODO) => ids.includes(repositorie.name))
      .sort((a: $TODO, b: $TODO) => b.stargazers_count - a.stargazers_count)
    },
    [StoreNames.NPMRepositories](state, getters) {
      return getters[StoreNames.OwnRepositories].filter(
        (repositorie: $TODO) => !!state.npmPackages.find(item => {
          return (
            // Personal repositorie
            repositorie.name === item?.package?.name ||
            // Github packages
            `@${GITHUB_UID}` === item?.package?.scope
          )
        })
      )
    },
    [StoreNames.GetRepositorieDetail](state) {
      return (repositorieName: string) => {
        return state.repositories.find(
          repositorie => repositorie.name === repositorieName
        )
      }
    }
  },
  mutations: {
    [StoreNames.UpdateInitedState](state, value: boolean) {
      state.inited = value
    },
    [StoreNames.UpdateGuestState](state, value: boolean) {
      state.isChinaGuest = value
    },
    [StoreNames.UpdateMobileState](state, value: boolean) {
      state.isMobileDevice = value
    },
    [StoreNames.UpdateUserInfo](state, value: $TODO) {
      state.userInfo = value
    },
    [StoreNames.UpdateRepositories](state, value: $TODO) {
      state.repositories = value
    },
    [StoreNames.UpdateOrganizations](state, value: $TODO) {
      state.organizations = value
    },
    [StoreNames.UpdateNPMPackages](state, value: $TODO) {
      state.npmPackages = value
    },
    [StoreNames.SetPackageDownloads](state, value: $TODO) {
      state.npmPackagesDownloadsMap[value.package] = value.downloads
    }
  },
  actions: {
    [StoreNames.GetUserInfo](vuexContext) {
      return http.getUserInfo().then(userinfo => {
        vuexContext.commit(StoreNames.UpdateUserInfo, userinfo)
      })
    },
    [StoreNames.GetRepositories](vuexContext) {
      return http.getRepositories().then(repositories => {
        vuexContext.commit(StoreNames.UpdateRepositories, repositories)
      })
    },
    [StoreNames.GetOrganizations](vuexContext) {
      return http.getOriginations().then(organizations => {
        vuexContext.commit(StoreNames.UpdateOrganizations, organizations)
      })
    },
    [StoreNames.GetNPMPackages](vuexContext) {
      return http.getNPMPackages().then(packages => {
        vuexContext.commit(StoreNames.UpdateNPMPackages, packages)
      })
    },
    [StoreNames.GetPackageDownloads](vuexContext, repoName: string) {
      return http.getNPMPackagesDownloads(repoName).then(value => {
        vuexContext.commit(StoreNames.SetPackageDownloads, value)
      })
    },
    [StoreNames.Init](vuexContext) {
      // 用户来源
      vuexContext.commit(
        StoreNames.UpdateGuestState,
        navigator.language.includes('zh-CN')
      )
      // 设备类型
      vuexContext.commit(
        StoreNames.UpdateMobileState,
        (
          /Android/i.test(navigator.userAgent) ||
          /webOS/i.test(navigator.userAgent) ||
          /iPhone/i.test(navigator.userAgent) ||
          /iPad/i.test(navigator.userAgent) ||
          /iPod/i.test(navigator.userAgent) ||
          /BlackBerry/i.test(navigator.userAgent) ||
          /Windows Phone/i.test(navigator.userAgent)
        )
      )
      return Promise.all([
        vuexContext.dispatch(StoreNames.GetUserInfo),
        vuexContext.dispatch(StoreNames.GetRepositories),
        vuexContext.dispatch(StoreNames.GetNPMPackages)
      ])
      .then(() => Promise.all(
        vuexContext.getters[StoreNames.NPMRepositories].map(
          ({ name }: $TODO) => vuexContext.dispatch(
            StoreNames.GetPackageDownloads, name
          )
        )
      ))
      .finally(() => {
        vuexContext.commit(StoreNames.UpdateInitedState, true)
      })
    }
  }
})

export default store
export function useStore(): typeof store {
  return useVuexStore()
}
