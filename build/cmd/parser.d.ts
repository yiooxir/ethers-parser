import { EventData } from "./interfaces";
export declare class Parser<DataType> {
    readonly _parseBunch: number;
    readonly _fromAddress: string;
    readonly _fromBlock: number;
    readonly _toBlock: number;
    readonly _eventName: string;
    readonly _printLog: boolean;
    readonly _provider: any;
    readonly _iface: any;
    readonly _loadValue: boolean;
    private readonly __blockMemo;
    protected _print(message: any): void;
    protected _getBlockTimestamp(blockNum: number): Promise<any>;
    protected _decode(log: any): Promise<EventData | null>;
    protected _parse(skip: any, limit: any): Promise<EventData[]>;
    constructor({ bunch, address, fromBlock, toBlock, eventName, printLog, provider, network, providerName, providerApiKey, abi, loadValue }: {
        bunch?: number;
        address: any;
        fromBlock: any;
        toBlock: any;
        eventName: any;
        printLog?: boolean;
        provider?: any;
        network?: string;
        providerName?: string;
        providerApiKey?: string;
        abi: any;
        loadValue?: boolean;
    });
    parse(onProgressFn: ({ from, to, data }: {
        from: any;
        to: any;
        data: any;
    }) => void): Promise<void>;
}
