// import { User } from './models/user'
import * as amplitude from '@amplitude/analytics-browser'
import { MemoryStorage } from '@amplitude/analytics-core'
import { BrowserClient } from '@amplitude/analytics-types'
import UAParser from 'ua-parser-js'

const parser = new UAParser()

interface IResult {
  [key: string]: any
}

const result: IResult = parser.getResult()
const osName = result.os.name
const osVersion = result.os.version

let amplitudeInstance: null | BrowserClient = null
let queuedEvents: any[] = []

async function trackEvent(event: string, payload: any) {
  if (amplitudeInstance) {
    await amplitudeInstance.track(event, payload).promise
  } else {
    // queuing events before the Amplitude instance is initialized
    queuedEvents.push({ event, payload })
  }
}

function isString(value: any): value is string {
  return typeof value === 'string'
}

function isLocalStorageEnabled() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const key = '__amp_storage_test__'
    window.localStorage.setItem(key, key)
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export async function analyticsInit() {
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  if (!apiKey || amplitudeInstance) {
    return
  }

  const canUseLocalStorage = isLocalStorageEnabled()
  amplitudeInstance = amplitude.createInstance()
  await amplitudeInstance.init(apiKey, {
    defaultTracking: {
      pageViews: true,
      fileDownloads: true,
    },
    identityStorage: canUseLocalStorage ? 'localStorage' : 'none',
    ...(canUseLocalStorage ? {} : { storageProvider: new MemoryStorage() }),
  })

  const identifyObj = new amplitude.Identify()
  // identifyObj.set('user_id', user.email)
  if (isString(osName)) {
    identifyObj.set('os_name', osName)
  }
  if (isString(osVersion)) {
    identifyObj.set('os_version', osVersion)
  }

  if (typeof result === 'object' && result !== null) {
    for (const key in result) {
      identifyObj.set(key, result[key])
    }
  }

  await amplitude.identify(identifyObj)

  for (const { event, payload } of queuedEvents) {
    amplitudeInstance.track(event, payload)
  }
  queuedEvents = []
}

export function analyticsLogEvent(eventName: string, eventProperties = {}) {
  trackEvent(eventName, eventProperties)
}

export async function analyticsAwaitLogEvent(
  eventName: string,
  eventProperties = {},
): Promise<void> {
  await trackEvent(eventName, eventProperties).catch(() => {})
}

export function analyticsTrackDownload(file: string) {
  trackEvent('Downloaded File', {
    filename: file,
    page_location: window.location.origin,
  })
}

export function analyticsTrackPageViewed(page: string) {
  trackEvent('Page Viewed', { page: page })
}

export default amplitudeInstance
