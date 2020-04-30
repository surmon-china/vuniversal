<template>
  <div class="index-page">
    <div class="container">
      <aside class="aside">
        <transition name="module">
          <div v-if="userInfo" class="gravatar">
            <img class="image" :draggable="false" :src="userInfo.avatar_url">
            <h2>{{ userInfo.name || '-' }}</h2>
            <p>{{ userInfo.bio || '-' }}</p>
            <p class="sponsor">
              <github-button-base
                :link="githubSponsorsUrl"
                :count="userInfo.followers"
                :count-link="githubFollowersUrl"
                icon="icon-heart"
                icon-color="#ea4aaa"
              >
                Sponsor
              </github-button-base>
            </p>
          </div>
        </transition>
        <transition name="module">
          <div v-if="userInfo" class="profile">
            <p v-if="userInfo.html_url" class="item">
              <i class="iconfont icon-github" />
              <a class="text link" target="_blank" :href="userInfo.html_url">@{{ userInfo.login }}</a>
            </p>
            <p v-if="userInfo.email" class="item">
              <i class="iconfont icon-mail" />
              <a class="text link" target="_blank" :href="'mailto://' + userInfo.email">{{ userInfo.email }}</a>
            </p>
            <p v-if="userInfo.blog" class="item">
              <i class="iconfont icon-link" />
              <a class="text link" target="_blank" :href="userInfo.blog">{{ userInfo.blog }}</a>
            </p>
            <span v-if="userInfo.location" class="item">
              <i class="iconfont icon-location" />
              <span class="text">{{ userInfo.location }}</span>
            </span>
          </div>
        </transition>
      </aside>
      <main class="detail">
        <h3>Open Source Software</h3>
        <p class="sub-title">I am passionate about open source software and giving back to others. My projects are trusted by thousands of developers all over the world.</p>
        <div class="homepage-statistics">
          <div class="item">
            <animated-number
              class="count"
              :number="inited ? repositorieStarTotal : 0"
            />
            <p class="name">
              <i class="iconfont icon-star" />
              <span>Total GitHub stars</span>
            </p>
          </div>
          <div class="item">
            <a :href="githubSponsorsUrl" target="_blank" class="sponsor">
              <i class="iconfont icon-heart" />
            </a>
          </div>
          <div class="item">
            <animated-number
              class="count"
              :number="inited ? packageDownloadTotal : 0"
            />
            <span class="name">
              <i class="iconfont icon-npm" />
              <span>Total NPM downloads</span>
            </span>
          </div>
        </div>
        <hr>
        <h3>Homepages | examples</h3>
        <p class="sub-title">Homepages and examples for GitHub repositories.</p>
        <transition name="module" mode="out-in">
          <p v-if="!inited">Loading...</p>
          <ul v-else class="homepage-repo-list">
            <li v-for="repo in exampleRepositories" :key="repo.clone_url" class="item">
              <div class="wrapper">
                <span>
                  <i class="iconfont icon-link" />
                  <a class="name" target="_blacnk" :href="repo.homepage">{{ repo.name }}</a>
                  <span v-if="repo.archived" class="archived">Archived</span>
                </span>
                <span class="meta">
                  <template v-if="!repo.archived">
                    <transition name="module" mode="out-in">
                      <badge-npm-downloads
                        v-if="isNPMPackage(repo.name)"
                        :name="repo.name"
                        class="badge"
                      />
                      <badge-last-commit
                        v-else
                        :name="repo.name"
                        class="badge"
                      />
                    </transition>
                  </template>
                  <span class="star">
                    <i class="iconfont icon-star" />
                    <span class="count">{{ repo.stargazers_count }}</span>
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </transition>
        <hr>
        <transition name="module">
          <div v-if="enableAd" class="index-mammon">
            <mammon :provider="adProvider" />
          </div>
        </transition>
        <h3>Projects</h3>
        <p class="sub-title">GitHub repositories that I've built.</p>
        <transition name="module" mode="out-in">
          <p v-if="!inited">Loading...</p>
          <ul v-else class="detail-repo-list">
            <li v-for="repo in repositories" :key="repo.clone_url" class="item">
              <p class="title">
                <span>
                  <i class="iconfont icon-repo" />
                  <a class="name" target="_blacnk" :href="repo.html_url">{{ repo.full_name }}</a>
                  <span v-if="repo.archived" class="archived">Archived</span>
                </span>
                <template v-if="!repo.archived">
                  <span v-if="isNPMPackage(repo.name)" class="npm">
                    <badge-npm-downloads interval="dy" :name="repo.name" />
                    <badge-npm-version :name="repo.name" />
                  </span>
                  <badge-last-commit v-else :name="repo.name" />
                </template>
              </p>
              <p class="desc">{{ repo.description }}</p>
              <p class="meta">
                <span class="item">
                  <i class="iconfont icon-star" />
                  <span>{{ repo.stargazers_count }}</span>
                </span>
                <span class="item">
                  <i class="iconfont icon-fork" />
                  <span>{{ repo.forks_count }}</span>
                </span>
                <span class="item">
                  <i class="iconfont icon-issue" />
                  <span>{{ repo.open_issues_count }}</span>
                </span>
                <span v-if="repo.license" class="item license">
                  <i class="iconfont icon-law" />
                  <span>{{ repo.license.name }}</span>
                </span>
                <span v-if="repo.language" class="item language">
                  <i class="iconfont icon-code" />
                  <span>{{ repo.language }}</span>
                </span>
              </p>
            </li>
          </ul>
        </transition>
        <hr>
        <h3>Organizations</h3>
        <p class="sub-title">GitHub organizations that I've built.</p>
        <transition name="module" mode="out-in">
          <p v-if="isFetchingOrganizations">Loading...</p>
          <ul v-else class="homepage-org-list">
            <template v-for="org in organizations">
              <li v-if="org.description" :key="org.login" class="item">
                <div class="wrapper">
                  <img class="logo" :src="org.avatar_url" :alt="org.login">
                  <div class="content">
                    <a class="name" target="_blacnk" :href="getOrganizationUrl(org.login)">{{ org.login }}</a>
                    <p class="desc">{{ org.description }}</p>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </transition>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, watch, onMounted } from 'vue'
  import { StoreNames, useStore } from '@/store'
  import { getOrganizationUrl } from '@/transformers/url'
  import GithubButtonBase from '@/components/github-button/base.vue'
  import BadgeNpmDownloads from '@/components/badge/download.vue'
  import BadgeLastCommit from '@/components/badge/last-commit.vue'
  import BadgeNpmVersion from '@/components/badge/version.vue'
  import AnimatedNumber from '@/components/animated-number'
  import Mammon, { MammonProvider } from '@/components/mammon/index.vue'
  import CONSTANTS from '@/constants'

  export default defineComponent({
    name: 'index',
    components: {
      Mammon,
      GithubButtonBase,
      BadgeNpmDownloads,
      BadgeLastCommit,
      BadgeNpmVersion,
      AnimatedNumber
    },
    setup() {
      const store = useStore()
      const enableAd = ref(false)
      const inited = computed(() => store.state.inited)
      const userInfo = computed(() => store.state.userInfo)
      const organizations = computed(() => store.state.organizations)
      const repositories = computed(() => store.getters[StoreNames.OwnRepositories])
      const isFetchingOrganizations = ref(false)
      const exampleRepositories = computed(() => {
        return repositories.value.filter(
          (repo: any) => !!repo.homepage && repo.homepage !== CONSTANTS.PROJECT_URL
        )
      })

      const repositorieStarTotal = computed(() => {
        return repositories.value.reduce(
          (total: number, repo: $TODO) => repo.stargazers_count + total, 0
        )
      })
      const packageDownloadTotal = computed(() => {
        return Object
          .values<number>(store.state.npmPackagesDownloadsMap)
          .reduce((plus, item) => plus + item, 0)
      })

      // NPM Package
      const isNPMPackage = (name: string): boolean => {
        return store.getters[StoreNames.NPMRepositories]
          .map(({ name }: $TODO) => name)
          .includes(name)
      }

      // China user -> random Aliyun (70%) / ADSense (30%)
      // Other user -> ADSense
      const isMobileDevice = computed(() => store.state.isMobileDevice)
      const isChinaGuest = computed(() => store.state.isChinaGuest)
      const adProvider = (!isChinaGuest.value || isMobileDevice.value)
        ? MammonProvider.GoogleAdSense1
        : ((Math.ceil(Math.random() * 10) > 7)
            ? MammonProvider.Aliyun
            : MammonProvider.GoogleAdSense1
          )

      watch(
        () => inited,
        inited => {
          inited && window.setTimeout(() => {
            enableAd.value = true
          }, 666)
        }
      )

      onMounted(() => {
        isFetchingOrganizations.value = true
        store
          .dispatch(StoreNames.GetOrganizations)
          .finally(() => {
            isFetchingOrganizations.value = false
          })
      })

      return {
        inited,
        userInfo,
        repositories,
        organizations,
        exampleRepositories,
        repositorieStarTotal,
        packageDownloadTotal,
        isNPMPackage,
        isFetchingOrganizations,
        enableAd,
        adProvider,
        getOrganizationUrl,
        githubUID: CONSTANTS.GITHUB_UID,
        githubFollowersUrl: CONSTANTS.GITHUB_FOLLOWERS_URL,
        githubSponsorsUrl: CONSTANTS.GITHUB_SPONSORS_URL
      }
    }
  })
</script>

<style lang="scss" scoped>
  .index-page {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-large;

    .container {
      height: 90%;
      overflow: hidden;
      background-color: $module-bg;
      display: flex;

      .aside {
        width: 24%;
        height: 100%;
        background-color: $github-secondary;
        color: $text-reverse;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        * {
          user-select: none;
        }

        .gravatar {
          padding: 2rem 1rem;
          text-align: center;
          background-color: $github-primary;

          .image {
            $size: 110px;
            border-radius: 100%;
            border: 3px solid $text-reverse;
            width: $size;
            height: $size;
            transition: transform $transition-time-slow;

            &:hover {
              transform: rotate(360deg);
            }
          }

          .sponsor {
            margin-top: 2rem;
            margin-bottom: 0;
          }
        }

        .profile {
          padding: $gap $lg-gap;

          .item {
            margin-top: 0;
            margin-bottom: $gap;

            .text {
              color: $text-reverse;

              &.link {
                text-decoration: unset;

                &:hover {
                  text-decoration: underline;
                }
              }
            }

            .iconfont {
              font-size: $iconfont-size;
              margin-right: $sm-gap;
            }
          }
        }
      }

      .index-mammon {
        margin: $gap 0;
        background-color: $module-bg-darken;
      }

      .detail {
        flex-grow: 1;
        padding: 1rem 2rem;
        overflow-y: auto;
        overflow-x: hidden;
        background: $module-bg;
        border-left: none;

        .sub-title {
          line-height: 1.66em;
          color: $text-secondary;
        }

        hr {
          height: 1px;
          border: 0;
          margin-top: $lg-gap;
          background-color: $body-bg;
        }

        .homepage-repo-list,
        .detail-repo-list {
          .archived {
            margin-left: $xs-gap;
            padding: 1px ($xs-gap / 2);
            border: 1px solid rgba($text-secondary, $golden-ratio);
            border-radius: $radius * 2;
            color: $text-secondary;
            font-size: $font-size-small;
          }
        }

        .homepage-statistics {
          height: 6rem;
          display: flex;
          justify-content: space-evenly;

          .item {
            flex: 1;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .sponsor {
              text-decoration: none;
              opacity: .8;
              @include visibility-transition();

              &:hover {
                opacity: 1;
              }

              .iconfont {
                font-size: $font-size-huge * 2.6;
                color: $github-sponsor-primary;
              }
            }

            .count {
              font-weight: bolder;
              font-size: $font-size-huge * 2;
            }

            .name {
              margin-top: $gap;
              margin-bottom: 0;

              .iconfont {
                margin-right: $xs-gap;
              }
            }
          }
        }

        .homepage-repo-list {
          list-style-type: square;

          .iconfont {
            margin-right: $sm-gap;
          }

          > .item {
            margin-top: $gap * 2;
            &:not(:first-child) {
              margin-top: $lg-gap;
            }

            .wrapper {
              display: flex;
              justify-content: space-between;

              .name {
                color: $link-color;
              }

              .meta {
                display: inline-flex;
                align-items: center;

                .star {
                  width: 5em;
                }

                ::v-deep(.badge) {
                  margin-right: $gap;
                }
              }
            }
          }
        }

        .homepage-org-list {
          list-style-type: square;
          margin: ($gap * 2) 0;

          .item {
            margin-top: $lg-gap;

            .wrapper {
              display: flex;
              flex-direction: row;
              align-items: center;

              .logo {
                width: 32px;
                height: 32px;
                background-color: $module-bg;
                border-radius: 50%;
                margin-right: $gap;
              }

              .content {
                .desc {
                  font-size: $font-size-small;
                  color: $text-secondary;
                  margin-bottom: 0;
                }
              }
            }
          }
        }

        .detail-repo-list {
          list-style-type: square;
          margin-bottom: $gap * 2;

          > .item {
            margin-top: $gap * 2;

            .title {
              display: flex;
              justify-content: space-between;

              .name {
                font-weight: bold;
              }

              .npm {
                display: inline-flex;

                ::v-deep(.badge) {
                  margin-left: $sm-gap;
                }
              }
            }

            .desc,
            .meta {
              color: $text-secondary;
            }

            .meta {
              font-size: $font-size-small;
              .iconfont {
                font-size: $font-size-base;
                margin-right: $xs-gap;
              }

              .item {
                margin-right: $gap;

                &.language {
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;

                  .iconfont {
                    margin-right: $xs-gap;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: $container-width), screen and (max-height: 600px) {
    .index-page {
      position: relative;
      height: auto;

      .container {
        width: 100%;
        height: auto;
        flex-direction: column;

        .aside {
          width: 100%;
          height: auto;
        }

        .detail {
          overflow: hidden;

          .homepage-repo-list,
          .homepage-org-list,
          .detail-repo-list {
            padding-left: 2rem;
          }

          .homepage-statistics {
            height: auto;
            flex-direction: column;

            .item {
              margin: $gap 0;
            }
          }

          .homepage-repo-list {
            .item {
              margin-top: $lg-gap;

              .wrapper {
                flex-direction: column;

                .meta {
                  margin-top: $gap;
                  flex-direction: row-reverse;
                  justify-content: flex-end;
                }
              }
            }
          }

          .detail-repo-list {
            .item {
              .title {
                flex-direction: column;

                .badge {
                  margin-top: $gap;
                }
              }

              .meta {
                .language {
                  display: none !important;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
