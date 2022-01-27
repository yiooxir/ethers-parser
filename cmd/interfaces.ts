export type Timestamp = number
export type Address = string
export type Hash = string
export type Eth = number

export type BigNumber = {
  "type": "BigNumber",
  "hex": string
}

export type Log = {
  "blockNumber": number,
  "blockHash": string,
  "transactionIndex": number,
  "removed": boolean,
  "address": string,
  "data": string,
  "topics": string[],
  "transactionHash": string,
  "logIndex": number
}

export type Event = {
  "eventFragment": {
    "name": string,
    "anonymous": boolean,
    "inputs": Array<{
      name: string,
      type: string,
      indexed: boolean,
      components: any,
      arrayLength: null,
      arrayChildren: null,
      baseType: string,
      _isParamType: boolean}>,
    "type": string // "event",
    "_isFragment": boolean
  },
  "name": string // "DragonCreated",
  "signature": string //"DragonCreated(uint256,uint256,uint256,uint256,uint256,uint8,uint256,address,address)",
  "topic": string // "0x30c3ef581371c1f32a51a227038345b13000b518164478749ef983a91f8466b2",
  "args": { [key: string]: any }
}

export type Transaction = {
  "hash": string,
  "type": number,
  "accessList": [],
  "blockHash": string,
  "blockNumber": number,
  "transactionIndex": number,
  "confirmations": number,
  "from": string,
  "gasPrice": BigNumber,
  "maxPriorityFeePerGas": BigNumber,
  "maxFeePerGas": BigNumber,
  "gasLimit": BigNumber,
  "to": string //"0xaaE9DF0F50D53f9AC50651bF69590aB7b1091451",
  "value": BigNumber,
  "nonce": number,
  "data": string,
  "r": string,
  "s": string,
  "v": number,
  "creates": any | null,
  "chainId": number
}

export type EventData = {
  eventData: {[key: string]: any},
  eventName: string,
  transactionHash: Hash,
  timestamp: Timestamp,
  value: Eth,
  blockNumber: number,
  _transaction: Transaction,
  _log: Log
}