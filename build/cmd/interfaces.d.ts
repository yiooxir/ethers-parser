export declare type Timestamp = number;
export declare type Address = string;
export declare type Hash = string;
export declare type Eth = number;
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
    "gasPrice": {
        "type": "BigNumber";
        "hex": string;
    };
    "maxPriorityFeePerGas": {
        "type": "BigNumber";
        "hex": string;
    };
    "maxFeePerGas": {
        "type": "BigNumber";
        "hex": string;
    };
    "gasLimit": {
        "type": "BigNumber";
        "hex": string;
    };
    "to": "0xaaE9DF0F50D53f9AC50651bF69590aB7b1091451";
    "value": {
        "type": "BigNumber";
        "hex": string;
    };
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
