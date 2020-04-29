/**
 * @file App constants
 * @module app.constants
 * @author Surmon <https://github.com/surmon-china>
 */

import { getSponsorsUrl, getUserPageUrl, getFollowersUrl } from './transformers/url'
const packageJSON = require('../package.json')
const appConfig = require('../app.config.json')

export const PROJECT_URL = packageJSON.homepage
export const PROJECT_NAME = packageJSON.name

export const NPM_UID = appConfig.NPM_UID
export const GITHUB_UID = appConfig.GITHUB_UID
export const GITHUB_USER_URL = getUserPageUrl(GITHUB_UID)
export const GITHUB_FOLLOWERS_URL = getFollowersUrl(GITHUB_UID)
export const GITHUB_SPONSORS_URL = getSponsorsUrl(GITHUB_UID)

export const GitHubRepositorieIDs = appConfig.GitHubRepositorieIDs as {
  [key: string]: string
}

const ALIYUN_PARTER_URL_FIXED = 'https://www.aliyun.com/minisite/goods?userCode=pu7fghvl'
const ALIYUN_PARTER_URL_HOTSALE = 'https://www.aliyun.com/acts/hotsale?userCode=pu7fghvl'

export const GOOGLE_ADSENSE_CLIENT = 'ca-pub-4710915636313788'
export const ALIYUN_ADS = [
  {
    image: '/images/mammon/aliyun-banner-4.jpg',
    url: ALIYUN_PARTER_URL_FIXED
  },
  {
    image: '/images/mammon/aliyun-banner-3.jpg',
    url: ALIYUN_PARTER_URL_HOTSALE
  }
]

export default Object.freeze({
  PROJECT_URL,
  PROJECT_NAME,

  NPM_UID,
  GITHUB_UID,
  GITHUB_USER_URL,
  GITHUB_FOLLOWERS_URL,
  GITHUB_SPONSORS_URL,

  GOOGLE_ADSENSE_CLIENT,
  ALIYUN_ADS
})
