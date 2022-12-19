import {z} from 'zod'

export class Result<T, E = Error> {
  private constructor(private value: {isOk: true; value: T} | {isOk: false; value: E}) {}

  static Ok = <T>(value: T) => new Result<T, never>({isOk: true, value})
  static Err = <E>(error: E) => new Result<never, E>({isOk: false, value: error})

  static map =
    <T, U>(mapper: (e: T) => U) =>
    <E>(r: Result<T, E>) =>
      r.map(mapper)

  static flatMap =
    <U, T, E>(mapper: (e: T) => Result<U, E>) =>
    (r: Result<T, E>) =>
      r.flatMap(mapper)

  static unwrapWithErr = <T, E>(r: Result<T, E>) => r.unwrapWithErr()
  static unwrapAndThrow = <T, E>(r: Result<T, E>) => r.unwrapAndThrow()

  map = <U>(mapper: (e: T) => U) =>
    this.value.isOk ? new Result<U, E>({isOk: true, value: mapper(this.value.value)}) : new Result<U, E>(this.value)

  flatMap = <U>(mapper: (e: T) => Result<U, E>): Result<U, E> =>
    this.value.isOk ? mapper(this.value.value) : Result.Err<E>(this.value.value)

  unwrapWithErr() {
    return this.value
  }

  unwrapAndThrow() {
    if (!this.value.isOk) throw this.value.value
    return this.value.value
  }
}

export const caseInsensitiveEnum = <U extends string, T extends [U, ...U[]]>(values: T) =>
  z.preprocess(e => (typeof e === 'string' ? e.toUpperCase() : e), z.enum(values))

export const generateRandomSourceId = () => `sender-${Math.ceil(Math.random() * 10e5)}`

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
