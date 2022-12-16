export * as Media from './media.types'
export * as Messages from './messages.types'
import {Maybe} from '../utils'

// https://developers.google.com/cast/docs/reference/web_sender/chrome.cast#.VolumeControlType
export type VolumeControlType = 'ATTENUATION' | 'FIXED' | 'MASTER'

// https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.Volume
export type Volume = {
  controlType: VolumeControlType
  level?: Maybe<number>
  muted?: Maybe<boolean>
  stepInterval: number
}

// https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.Session
// https://github.com/vitalidze/chromecast-java-api-v2/blob/master/src/main/java/su/litvak/chromecast/api/v2/Application.java
export type Application = {
  appId: string
  displayName: string
  iconUrl?: Maybe<string>
  isIdleScreen?: Maybe<boolean>
  launchedFromCloud?: Maybe<boolean>
  namespaces: {name: string}[]
  sessionId: string
  statusText?: Maybe<string>
  transportId: string
}

export interface ReceiverStatus {
  applications: Application[]
  volume: Volume
}
