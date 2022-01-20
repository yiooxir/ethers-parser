import {Parser} from "../cmd/parser";
import DragonCrossbreed from "./fixture/contracts/DragonCrossbreed.sol/DragonCrossbreed.json";
import {EventData} from "../cmd/interfaces";

it('debug', async () => {
  const parser = new Parser({
    bunch: 1000,
    address: '0xf479e3b0dbcac892e1fc4978a1634645710fe827',
    fromBlock: 13868089,
    toBlock: 13990194,
    eventName: 'RewardAdded',
    providerName: 'InfuraProvider',
    providerApiKey: 'dde658cd27a740a3983c2ecce4884407',
    abi: DragonCrossbreed.abi,
    loadValue: true
  })

  let count = 0
  let amount = 0
  let gas = 0

  const _getGas = (item: EventData): number => {
    return Number(item._transaction.gasLimit) * Number(item._transaction.gasPrice) * 1e-18
  }

  const _getAmount = (item:EventData ): number => {
    return item.eventData.amount * 1e-18
  }

  const callback = ({from, to, data}) => {
    count += data.length
    data.forEach(i => {
      amount += _getAmount(i); gas += _getGas(i)
    })
    console.log('gas=', gas, '; amount=', amount, 'count=', count)
  }

  const res = await parser.parse(callback)

  console.log(res)
})

// Blocks 13880089-13881088 processed. Resolved 2915 Events.
// gas= 21.162142485264432 ; amount= 7.1977111607210675 count= 8971

// Blocks 13881089-13882088 processed. Resolved 5142 Events.
// gas= 33.19924726924663 ; amount= 10.65569629253542 count= 14113

// Blocks 13882089-13883088 processed. Resolved 3106 Events.
// gas= 39.688310689709816 ; amount= 12.966906674637212 count= 17219