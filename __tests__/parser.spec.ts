import Parser from "../index";
import * as sinon from 'sinon'
import * as ethers from 'ethers'
import DragonCreator from './fixture/contracts/DragonCreator.sol/DragonCreator.json'
import logHash from './fixture/logHash.json'
import blockHash from './fixture/blockHash.json'


describe('parser', () => {
  const sandbox = sinon.createSandbox()
  const cfg = {
    bunch: 5,
    address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C',
    fromBlock: 10,
    toBlock: 20,
    eventName: 'DragonCreated',
    abi: DragonCreator.abi,
    printLog: false
  }
  let parser, provider
  let stub

  beforeEach(() => {
    provider = new ethers.providers.InfuraProvider('mainnet', '123')
    stub = sandbox.stub(provider)
    stub.getLogs.returns([logHash])
    stub.getBlock.returns(blockHash)
    parser = new Parser({...cfg, provider})
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('Should call with correct pagination frame', async () => {
    stub.getLogs.returns([])
    const spy = sandbox.fake()
    await parser.parse(spy)
    sandbox.assert.calledWith(spy.getCall(0), {from: 10, to: 14, data: []})
    sandbox.assert.calledWith(spy.getCall(1), {from: 15, to: 19, data: []})
    sandbox.assert.calledWith(spy.getCall(2), {from: 20, to: 20, data: []})
  })

  it('Should call provider.getLogs with correct filter params', async () => {
    const spy = provider.getLogs
    await parser.parse(() => {})
    sandbox.assert.calledWith(spy.getCall(0), {address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C', fromBlock: 10, toBlock: 14})
    sandbox.assert.calledWith(spy.getCall(1), {address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C', fromBlock: 15, toBlock: 19})
    sandbox.assert.calledWith(spy.getCall(2), {address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C', fromBlock: 20, toBlock: 20})
  })

  it('Should call provider.getBlock at once then gets same block numbers (check memoization)', async () => {
    const spy = provider.getBlock
    await parser.parse(() => {})
    sandbox.assert.calledOnce(spy)
  })

  it('Should  load transaction if @loadValue is true', async () => {
    const spy = provider.getTransaction

    parser = new Parser({...cfg, provider, loadValue: true})
    await parser.parse(() => {})
    sandbox.assert.calledThrice(spy)
  })

  it('Should not load transaction from network only if param @loadValue is false ', async () => {
    const spy = provider.getTransaction
    parser = new Parser({...cfg, provider, loadValue: false})
    await parser.parse(() => {})
    sandbox.assert.notCalled(spy)
  })

  it('Should split a large logs into parts and parse them consistently', async () => {
    const testLog = [...Array(150).keys()]
    provider.getLogs.returns(testLog)
    sandbox.stub(parser, '_decode').callsFake((l) => l)
    const promiseSpy = sandbox.spy(Promise, 'all')
    await parser._parse(1,1)

    sandbox.assert.calledWith(promiseSpy, testLog.slice(0, 100))
    sandbox.assert.calledWith(promiseSpy, testLog.slice(100, 150))
  })

  it('Parser should await promised callback and complete work after all callback are resolved', async () => {
    stub.getLogs.returns([])
    const spy = sandbox.spy(async () => Promise.resolve())
    await parser.parse(spy)
    sandbox.assert.calledThrice(spy)
  })
})

