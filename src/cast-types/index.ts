export * as Media from './media.types'
export * as Messages from './messages.types'
import {z} from 'zod'

import {caseInsensitiveEnum} from '../utils'

// https://developers.google.com/cast/docs/reference/web_sender/chrome.cast#.VolumeControlType
export const VolumeControlType$ = caseInsensitiveEnum(['ATTENUATION', 'FIXED', 'MASTER'])
export type VolumeControlType = z.infer<typeof VolumeControlType$>

// https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.Volume
export const Volume$ = z.object({
  controlType: VolumeControlType$,
  level: z.number().nullish(),
  muted: z.boolean().nullish(),
  stepInterval: z.number(),
})
export type Volume = z.infer<typeof Volume$>

// https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.Session
// https://github.com/vitalidze/chromecast-java-api-v2/blob/master/src/main/java/su/litvak/chromecast/api/v2/Application.java
export const Application$ = z.object({
  appId: z.string(),
  displayName: z.string(),
  iconUrl: z.string().nullish(),
  isIdleScreen: z.boolean().nullish(),
  launchedFromCloud: z.boolean().nullish(),
  namespaces: z.array(z.object({name: z.string()})),
  sessionId: z.string(),
  statusText: z.string().nullish(),
  transportId: z.string(),
})
export type Application = z.infer<typeof Application$>

export const ReceiverStatus$ = z.object({
  applications: z.array(Application$).optional(),
  volume: Volume$,
})
export type ReceiverStatus = z.infer<typeof ReceiverStatus$>
