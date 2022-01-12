import {Parser} from "../cmd/parser";
import DragonCrossbreed from "./fixture/contracts/DragonCrossbreed.sol/DragonCrossbreed.json";

it('debug', async () => {
  const parser = new Parser({
    bunch: 500,
    address: '0xf479e3b0dbcac892e1fc4978a1634645710fe827',
    fromBlock: 13868089,
    toBlock: 13990194,
    eventName: 'RewardAdded',
    providerName: 'InfuraProvider',
    providerApiKey: 'dde658cd27a740a3983c2ecce4884407',
    abi: DragonCrossbreed.abi,
    loadValue: true
  })

  const callback = ({from, to, data}) => {
    // const r = from
    const r = from
  }

  const res = await parser.parse(callback)

  console.log(res)
})