import {Maybe} from '../utils'
import {IdleReason, MediaInformation as MessageMediaInformation} from './messages.types'

// https://developers.google.com/cast/docs/media/messages#MediaInformation
export type MediaInformation = MessageMediaInformation

export enum SupportedMediaCommands {
  PAUSE = 1,
  SEEK = 2,
  STREAM_VOLUME = 4,
  STREAM_MUTE = 8,
  SKIP_FORWARD = 16,
  SKIP_BACKWARD = 32,
}

// https://developers.google.com/cast/docs/media/messages#Volume
export type Volume = {
  level?: Maybe<number>
  muted?: Maybe<boolean>
}

export type PlayerState = 'IDLE' | 'PLAYING' | 'BUFFERING' | 'PAUSED'

// https://developers.google.com/cast/docs/media/messages#MediaStatus
export type MediaStatus = {
  currentTime: number
  customData?: Maybe<Record<string, unknown>>
  idleReason?: Maybe<IdleReason>
  media?: Maybe<MediaInformation>
  mediaSessionId: number
  playbackRate: number
  playerState: PlayerState
  supportedMediaCommands: number // sum of SupportedMediaCommands
  volume: Volume
}
