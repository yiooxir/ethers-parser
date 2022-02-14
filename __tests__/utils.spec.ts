import {safePromise} from "../cmd/utils";

describe('utils.safePromise()', () => {
  let i = 0, foo = async() => {
    return i++ < 4 ? Promise.reject(Error(`boo ${i}`)) : Promise.resolve(`good ${i}`)
  }

  it.skip('Should perform the specified attempts before rejecting', async () => {
    const re  = await safePromise(() => foo())
    console.log(re)
  })
})

