// import { User } from './models/user'
import * as amplitude from '@amplitude/analytics-browser'
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

export async function analyticsInit() {
  // amplitude.init('3fe72eb0657193f3adfb68c021bf5b62');
  amplitudeInstance = amplitude.createInstance()
  await amplitudeInstance.init('3fe72eb0657193f3adfb68c021bf5b62', {
    defaultTracking: {
      pageViews: true,
      fileDownloads: true,
    },
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
