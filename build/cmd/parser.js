"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const utils_1 = require("./utils");
const ethers = __importStar(require("ethers"));
class Parser {
    constructor({ bunch = 10, address, fromBlock, toBlock, eventName, printLog = true, provider = null, network = 'mainnet', providerName = 'InfuraProvider', providerApiKey = '', abi, loadValue = false }) {
        this.__blockMemo = new Map();
        this._parseBunch = bunch;
        this._fromAddress = address;
        this._fromBlock = fromBlock;
        this._toBlock = toBlock;
        this._eventName = eventName;
        this._printLog = printLog;
        this._provider = provider ? provider : new ethers.providers[providerName](network, providerApiKey);
        this._iface = new ethers.utils.Interface(abi);
        this._loadValue = loadValue;
    }
    _print(message) {
        this._printLog && console.debug(message);
    }
    _getBlockTimestamp(blockNum) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.__blockMemo.has(blockNum))
                return this.__blockMemo.get(blockNum);
            return ((blockNum) => __awaiter(this, void 0, void 0, function* () {
                const _bl = yield (0, utils_1.safePromise)(() => this._provider.getBlock(blockNum));
                this.__blockMemo.set(blockNum, _bl.timestamp);
                return _bl.timestamp;
            }))(blockNum);
        });
    }
    _decode(log) {
        return __awaiter(this, void 0, void 0, function* () {
            const _event = this._iface.parseLog(log);
            const { name } = _event.eventFragment;
            if (name !== this._eventName)
                return null;
            const { blockNumber, transactionHash } = log;
            const transaction = this._loadValue ? yield (0, utils_1.safePromise)(() => this._provider.getTransaction(transactionHash)) : null;
            return {
                eventData: (0, utils_1.extractEventData)(_event),
                eventName: name,
                transactionHash,
                timestamp: yield this._getBlockTimestamp(log.blockNumber),
                value: transaction ? transaction.value * 1e-18 : null,
                blockNumber,
                _transaction: transaction,
                _log: log,
            };
        });
    }
    _parse(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                address: this._fromAddress,
                fromBlock: skip,
                toBlock: skip + limit
            };
            const logs = yield (0, utils_1.safePromise)(() => this._provider.getLogs(filter));
            const _chunk = 100;
            const _slicedLog = [];
            for (let i = 0; i < logs.length; i += _chunk)
                _slicedLog.push(logs.slice(i, i + _chunk));
            if (_slicedLog.length > 1)
                this._print(`Log array is to big (${logs.length}) and will be parsed with ${_slicedLog.length} chunks.`);
            let result = [];
            for (let [i, lg] of _slicedLog.entries()) {
                result = result.concat(yield Promise.all(lg.map(l => this._decode(l))));
                if (_slicedLog.length > 1)
                    this._print(`Log chunk ${i + 1} processed.`);
            }
            return result;
        });
    }
    parse(onProgressFn) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _fromBlock, _toBlock, _parseBunch: limit } = this;
            for (let i = _fromBlock; i <= _toBlock; i += limit) {
                const _limit = _toBlock >= i + limit ? limit - 1 : _toBlock - i;
                const data = (yield this._parse(i, _limit)).filter(e => !!e);
                this._print(`Blocks ${i}-${i + _limit} processed. Resolved ${data.length} Events.`);
                yield onProgressFn({ from: i, to: i + _limit, data });
            }
        });
    }
}
exports.Parser = Parser;
