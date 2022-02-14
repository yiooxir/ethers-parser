export function extractEventData(event) {
  return event.eventFragment.inputs.map(e => e.name).reduce((res, prop) => {
    res[prop] = event.args[prop]
    return res
  }, {})
}

export async function safePromise(promiseFn, attempt = 3, __i = 0) {
  try {
    return await promiseFn()
  } catch (e: any) {
    if (__i < attempt) {
      console.warn(`Bad request. Retry ${__i + 1}. Message: ${e.message}`)
      return safePromise(promiseFn, attempt, ++__i)
    } else {
      throw new Error(e.message)
    }
  }
}
