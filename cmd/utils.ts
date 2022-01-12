export function extractEventData (event) {
  return event.eventFragment.inputs.map(e => e.name).reduce((res, prop) => {
    res[prop] = event.args[prop]
    return res
  }, {})
}