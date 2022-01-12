# Parser

Parse ether network using specified filter.

## How to use

Parser parses network using filter params: fromAddress, from, to - specified in config.
```
const Parser = require('./cmd/parser')
const parser = new Parser(cfg)
const cb = ({from, to, data}) => {...}
await parser.parse(cb)
```

**Constructor Config:**

|   Param| type         | optional  | default| description  |
|--------|------------  |---------- |--------| -------------|
| bunch  |  Int         |    true   |  10    | How mach blocks will be loaded in parallel       
| address|String        |   false   |   -    | Log filter address 
| fromBlock|Number      |   false   |   -    | Block to start parsing with 
| toBlock|Number        |   false   |   -    | Block where the parsing will end 
| eventName|String      |   false   |   -    | Name of log event which will be processed 
| printLog|Bool         |   true    |   true | Progress console 
| provider| Provider    |   true    |   -    | Ether Provider instance
| provider| Provider    |   true    |   -    | Ether Provider instance
| network| String       |   true    | mainnet| Network name. Optional if provider not set
| providerName| String  |   true    |   InfuraProvider    | Provider Name. Optional if provider not set
| providerApiKey| String|   false   |   -    | Provider Api Key. Optional if provider not set
| abi| json |   false   |   -       |   -    | abi for parse event data
| loadValue| json       |   false  |    -    | if true - transaction will not be load (will be always Null)


### Examples

Example with provider config:

```
const parser = new Parser({
    bunch: 5,
    address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C',
    fromBlock: 13979600,
    toBlock: 13979615,
    eventName: 'DragonCreated',
    providerName: 'InfuraProvider',
    providerApiKey: 'dde658cd27a740a3983c2ecce4884407',
    abi: require('path to abi json'),
    loadValue: true
  })

  const callback = ({from, to, data}) => {
    console.log(from, to, data)
  }
  
  const res = await parser.parse(callback)
```

Example with predefined provider:

```
const provider = new ethers.providers.InfuraProvider('mainnet', 'dde658cd27a740a3983c2ecce4884407')

const config = {
    bunch: 100,
    address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C',
    fromBlock: 13979600,
    toBlock: 13979615,
    eventName: 'DragonCreated',
    abi: require('path to abi json'),
    loadValue: true,
    provider
}

  const callback = ({from, to, data}) => {
    console.log(from, to, data)
  }
  
  const res = await parser.parse(callback)
```