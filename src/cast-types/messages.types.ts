import {Maybe} from '../utils'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages#.StreamType
export type StreamType = 'BUFFERED' | 'LIVE' | 'OTHER'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.MediaInformation
export type MediaInformation = {
  contentId: string
  contentType?: Maybe<string>
  contentUrl?: Maybe<string>
  customData?: Maybe<Record<string, unknown>>
  duration?: Maybe<number>
  metadata?: Maybe<Record<string, unknown>>
  streamType: StreamType
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages#.IdleReason
export type IdleReason = 'CANCELLED' | 'INTERRUPTED' | 'FINISHED' | 'ERROR'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueItem
export type QueueItem = {
  activeTrackIds?: Maybe<number[]>
  autoplay?: Maybe<boolean>
  customData?: Maybe<Record<string, unknown>>
  itemId?: Maybe<number>
  media?: Maybe<MediaInformation>
  orderId?: Maybe<number>
  startTime?: Maybe<number>
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages#.PlayerState
export type PlayerState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'BUFFERING'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages#.RepeatMode
export type RepeatMode = 'REPEAT_OFF' | 'REPEAT_ALL' | 'REPEAT_SINGLE' | 'REPEAT_ALL_AND_SHUFFLE'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.VideoInformation
export type VideoInfo = {width: number; height: number; hdrType: 'SDR' | 'HDR' | 'DV'}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.Volume
export type Volume = {
  level: number
  muted: boolean
}

export type MessageType =
  | 'MEDIA_STATUS'
  | 'CLOUD_STATUS'
  | 'QUEUE_CHANGE'
  | 'QUEUE_ITEMS'
  | 'QUEUE_ITEM_IDS'
  | 'GET_STATUS'
  | 'LOAD'
  | 'PAUSE'
  | 'STOP'
  | 'PLAY'
  | 'SKIP_AD'
  | 'PLAY_AGAIN'
  | 'SEEK'
  | 'SET_PLAYBACK_RATE'
  | 'SET_VOLUME'
  | 'EDIT_TRACKS_INFO'
  | 'EDIT_AUDIO_TRACKS'
  | 'PRECACHE'
  | 'PRELOAD'
  | 'QUEUE_LOAD'
  | 'QUEUE_INSERT'
  | 'QUEUE_UPDATE'
  | 'QUEUE_REMOVE'
  | 'QUEUE_REORDER'
  | 'QUEUE_NEXT'
  | 'QUEUE_PREV'
  | 'QUEUE_GET_ITEM_RANGE'
  | 'QUEUE_GET_ITEMS'
  | 'QUEUE_GET_ITEM_IDS'
  | 'QUEUE_SHUFFLE'
  | 'SET_CREDENTIALS'
  | 'LOAD_BY_ENTITY'
  | 'USER_ACTION'
  | 'DISPLAY_STATUS'
  | 'FOCUS_STATE'
  | 'CUSTOM_COMMAND'
  | 'STORE_SESSION'
  | 'RESUME_SESSION'
  | 'SESSION_STATE'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.RequestData
export interface RequestData {
  type: MessageType
  customData?: Maybe<Record<string, unknown>>
  mediaSessionId?: Maybe<number>
  requestId: number
  sequenceNumber?: Maybe<number>
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages#.SeekResumeState
export type SeekResumeState = 'PLAYBACK_START' | 'PLAYBACK_PAUSE'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.SeekRequestData
export interface SeekRequestData extends RequestData {
  currentTime?: Maybe<number>
  relativeTime?: Maybe<number>
  resumeState?: Maybe<SeekResumeState>
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueUpdateRequestData
export interface QueueUpdateRequestData extends RequestData {
  currentItemId?: Maybe<number>
  currentTime?: Maybe<number>
  customData?: Maybe<Record<string, unknown>>
  items?: Maybe<QueueItem[]>
  jump?: Maybe<number>
  repeatMode?: Maybe<RepeatMode>
  shuffle?: Maybe<boolean>
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueReorderRequestData
export interface QueueReorderRequestData extends RequestData {
  currentItemId?: Maybe<number>
  currentTime?: Maybe<number>
  insertBefore?: Maybe<number>
  itemIds: number[]
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueRemoveRequestData
export interface QueueRemoveRequestData extends RequestData {
  currentItemId?: Maybe<number>
  currentTime?: Maybe<number>
  insertBefore?: Maybe<number>
  itemIds: number[]
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueLoadRequestData
export interface QueueLoadRequestData extends RequestData {
  currentTime?: Maybe<number>
  items: QueueItem[]
  repeatMode?: Maybe<RepeatMode>
  startIndex?: Maybe<number>
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueInsertRequestData
export interface QueueInsertRequestData extends RequestData {
  currentItemId?: Maybe<number>
  currentItemIndex?: Maybe<number>
  currentTime?: Maybe<number>
  insertBefore?: Maybe<number>
  items: QueueItem[]
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.LoadOptions
export interface LoadOptions {
  contentFilteringMode?: Maybe<'FILTER_EXPLICIT'>
}

export type QueueType =
  | 'ALBUM'
  | 'PLAYLIST'
  | 'AUDIOBOOK'
  | 'RADIO_STATION'
  | 'PODCAST_SERIES'
  | 'TV_SERIES'
  | 'VIDEO_PLAYLIST'
  | 'LIVE_TV'
  | 'MOVIE'

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.QueueData
export interface QueueData {
  description?: Maybe<string>
  entity?: Maybe<string>
  id?: Maybe<string>
  items?: Maybe<QueueItem[]>
  name?: Maybe<string>
  queueType?: Maybe<QueueType>
  repeatMode?: Maybe<RepeatMode>
  shuffle?: Maybe<boolean>
  startIndex?: Maybe<number>
  startTime?: Maybe<number>
}

// https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.messages.LoadRequestData
export interface LoadRequestData extends RequestData {
  activeTrackIds?: Maybe<number[]>
  autoplay?: Maybe<boolean>
  credentials?: Maybe<string>
  credentialsType?: Maybe<string>
  currentTime?: Maybe<number>
  loadOptions?: Maybe<LoadOptions>
  media: MediaInformation
  playbackRate?: Maybe<number>
  queueData?: Maybe<QueueData>
}
