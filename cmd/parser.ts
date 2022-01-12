import {extractEventData} from "./utils";
import * as ethers from 'ethers'
import {EventData, Timestamp} from "./interfaces";


export class Parser<DataType> {
  readonly _parseBunch: number
  readonly _fromAddress: string
  readonly _fromBlock: number
  readonly _toBlock: number
  readonly _eventName: string
  readonly _printLog: boolean
  readonly _provider
  readonly _iface
  readonly _loadValue: boolean
  private readonly __blockMemo = new Map<number, Timestamp>()

  protected _print(message) {
    this._printLog && console.debug(message)
  }
  
  protected async _getBlockTimestamp(blockNum: number) {
    if (this.__blockMemo.has(blockNum))
      return this.__blockMemo.get(blockNum)

    return (async (blockNum) => {
      const _bl = await this._provider.getBlock(blockNum)
      this.__blockMemo.set(blockNum, _bl.timestamp)
      return _bl.timestamp
    })(blockNum)
  }

  protected async _decode(log): Promise<EventData | null> {
    const _event = this._iface.parseLog(log)
    const {name} = _event.eventFragment
    if (name !== this._eventName) return null

    const {blockNumber, transactionHash} = log
    const transaction = this._loadValue ? await this._provider.getTransaction(transactionHash) : null

    return {
      eventData: extractEventData(_event),
      eventName: name,
      transactionHash,
      timestamp: await this._getBlockTimestamp(log.blockNumber),
      value: transaction ? transaction.value * 1e-18 : null,
      blockNumber,
      _transaction: transaction,
      _log: log,
    }
  }

  protected async _parse(skip, limit): Promise<EventData[]> {
    const filter = {
      address: this._fromAddress,
      fromBlock: skip,
      toBlock: skip + limit
    }
    const logs = await this._provider.getLogs(filter)

    const _chunk = 100
    const _slicedLog = []

    for(let i = 0; i < logs.length; i += _chunk) _slicedLog.push(logs.slice(i, i + _chunk))
    if (_slicedLog.length > 1)
      this._print(`Log array is to big (${logs.length}) and will be parsed with ${_slicedLog.length} chunks.`)

    let result = []
    for(let [i, lg] of _slicedLog.entries()) {
      result = result.concat(await Promise.all(lg.map(l => this._decode(l))))
      if (_slicedLog.length > 1)
        this._print(`Log chunk ${i + 1} processed.`)
    }

    return result
  }

  constructor({
                bunch = 10,
                address,
                fromBlock,
                toBlock,
                eventName,
                printLog = true,
                provider = null,
                network = 'mainnet',
                providerName = 'InfuraProvider',
                providerApiKey = '',
                abi,
                loadValue = false
              }) {
    this._parseBunch = bunch
    this._fromAddress = address
    this._fromBlock = fromBlock
    this._toBlock = toBlock
    this._eventName = eventName
    this._printLog = printLog
    this._provider = provider ? provider : new ethers.providers[providerName](network, providerApiKey)
    this._iface = new ethers.utils.Interface(abi);
    this._loadValue = loadValue
  }

  public async parse(onProgressFn: ({from, to, data}) => void): Promise<void> {
    const {_fromBlock, _toBlock, _parseBunch: limit} = this

    for (let i = _fromBlock; i <= _toBlock; i += limit) {
      const _limit = _toBlock >= i + limit ? limit - 1 : _toBlock - i
      const data = (await this._parse(i, _limit)).filter(e => !!e)
      this._print(`Blocks ${i}-${i + _limit} processed. Resolved ${data.length} Events.`)
      onProgressFn({from: i, to: i + _limit, data})
    }
  }
}