export declare type Timestamp = number;
export declare type Address = string;
export declare type Hash = string;
export declare type Eth = number;
export declare type BigNumber = {
    "type": "BigNumber";
    "hex": string;
};
export declare type Log = {
    "blockNumber": number;
    "blockHash": string;
    "transactionIndex": number;
    "removed": boolean;
    "address": string;
    "data": string;
    "topics": string[];
    "transactionHash": string;
    "logIndex": number;
};
export declare type Event = {
    "eventFragment": {
        "name": string;
        "anonymous": boolean;
        "inputs": Array<{
            name: string;
            type: string;
            indexed: boolean;
            components: any;
            arrayLength: null;
            arrayChildren: null;
            baseType: string;
            _isParamType: boolean;
        }>;
        "type": string;
        "_isFragment": boolean;
    };
    "name": string;
    "signature": string;
    "topic": string;
    "args": {
        [key: string]: any;
    };
};
export declare type Transaction = {
    "hash": string;
    "type": number;
    "accessList": [];
    "blockHash": string;
    "blockNumber": number;
    "transactionIndex": number;
    "confirmations": number;
    "from": string;
    "gasPrice": BigNumber;
    "maxPriorityFeePerGas": BigNumber;
    "maxFeePerGas": BigNumber;
    "gasLimit": BigNumber;
    "to": string;
    "value": BigNumber;
    "nonce": number;
    "data": string;
    "r": string;
    "s": string;
    "v": number;
    "creates": any | null;
    "chainId": number;
};
export declare type EventData = {
    eventData: {
        [key: string]: any;
    };
    eventName: string;
    transactionHash: Hash;
    timestamp: Timestamp;
    value: Eth;
    blockNumber: number;
    _transaction: Transaction;
    _log: Log;
};
