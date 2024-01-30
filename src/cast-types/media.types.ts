import {z} from 'zod'

import {
  IdleReason$,
  MediaInformation$ as MessageMediaInformation$,
  PlayerState$ as MessagePlayerState$,
} from './messages.types'

// https://developers.google.com/cast/docs/media/messages#MediaInformation
export const MediaInformation$ = MessageMediaInformation$
export type MediaInformation = z.infer<typeof MediaInformation$>

export enum SupportedMediaCommands {
  PAUSE = 1,
  SEEK = 2,
  STREAM_VOLUME = 4,
  STREAM_MUTE = 8,
  SKIP_FORWARD = 16,
  SKIP_BACKWARD = 32,
}
export const SupportedMediaCommands$ = z.nativeEnum(SupportedMediaCommands)

// https://developers.google.com/cast/docs/media/messages#Volume
export const Volume$ = z.object({level: z.number().nullish(), muted: z.boolean().nullish()})
export type Volume = z.infer<typeof Volume$>

export const PlayerState$ = MessagePlayerState$
export type PlayerState = z.infer<typeof PlayerState$>

// https://developers.google.com/cast/docs/media/messages#MediaStatus
export const MediaStatus$ = z.object({
  currentTime: z.number(),
  customData: z.record(z.unknown()).nullish(),
  idleReason: IdleReason$.nullish(),
  media: MediaInformation$.nullish(),
  mediaSessionId: z.number(),
  playbackRate: z.number(),
  playerState: PlayerState$,
  supportedMediaCommands: z.number(), // sum of SupportedMediaCommands
  volume: Volume$.nullish(),
})
export type MediaStatus = z.infer<typeof MediaStatus$>
