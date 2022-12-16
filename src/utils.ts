export type Maybe<T> = T | null | undefined

export const withTimeout =
  ({timeout = 3000, onTimeout = () => {}, timeoutError = new Error('timed out')}) =>
  <T>(p: Promise<T>) =>
    Promise.race([
      p,
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          onTimeout()
          reject(timeoutError)
        }, timeout)
      }),
    ])

export const tryParseJSON = (s: string | Buffer): Record<string, unknown> | undefined => {
  try {
    const o = JSON.parse(s.toString())
    if (o && typeof o === 'object') return o
  } catch {
    return undefined
  }
}
