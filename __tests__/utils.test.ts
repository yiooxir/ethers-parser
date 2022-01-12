import {expect} from 'chai'
import {extractEventData} from "../cmd/utils";
import event from './fixture/eventHash.json'

it('util.extractEventData()', async () => {
  const tmpl = {
    dragonId: {
      "type":
        "BigNumber",
      "hex":
        "0x18db"
    },
    eggId: {
      "type":
        "BigNumber",
      "hex":
        "0x05ab"
    },
    parent1Id: {
      "type":
        "BigNumber",
      "hex":
        "0x00"
    },
    parent2Id: {
      "type":
        "BigNumber",
      "hex":
        "0x00"
    },
    generation: {
      "type":
        "BigNumber",
      "hex":
        "0x01"
    },
    genes: {
      "type": "BigNumber",
      "hex": "0x0c5080425b8d25c5"
    },
    t: 1,
    creator: "0xaaE9DF0F50D53f9AC50651bF69590aB7b1091451",
    to: "0xfe3fdbE9e3EA3F11Fe976010028eDfA33A383644"
  }
  expect(extractEventData(event)).to.eql(tmpl)
})
