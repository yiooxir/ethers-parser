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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const sinon = __importStar(require("sinon"));
const ethers = __importStar(require("ethers"));
const DragonCreator_json_1 = __importDefault(require("./fixture/contracts/DragonCreator.sol/DragonCreator.json"));
const logHash_json_1 = __importDefault(require("./fixture/logHash.json"));
const blockHash_json_1 = __importDefault(require("./fixture/blockHash.json"));
describe('parser', () => {
    const sandbox = sinon.createSandbox();
    const cfg = {
        bunch: 5,
        address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C',
        fromBlock: 10,
        toBlock: 20,
        eventName: 'DragonCreated',
        abi: DragonCreator_json_1.default.abi,
        printLog: false
    };
    let parser, provider;
    let stub;
    beforeEach(() => {
        provider = new ethers.providers.InfuraProvider('mainnet', 'dde658cd27a740a3983c2ecce4884407');
        stub = sandbox.stub(provider);
        stub.getLogs.returns([logHash_json_1.default]);
        stub.getBlock.returns(blockHash_json_1.default);
        parser = new index_1.default(Object.assign(Object.assign({}, cfg), { provider }));
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('Should call with correct pagination frame', () => __awaiter(void 0, void 0, void 0, function* () {
        stub.getLogs.returns([]);
        const spy = sandbox.fake();
        yield parser.parse(spy);
        sandbox.assert.calledWith(spy.getCall(0), { from: 10, to: 14, data: [] });
        sandbox.assert.calledWith(spy.getCall(1), { from: 15, to: 19, data: [] });
        sandbox.assert.calledWith(spy.getCall(2), { from: 20, to: 20, data: [] });
    }));
    it('Should call provider.getLogs with correct filter params', () => __awaiter(void 0, void 0, void 0, function* () {
        const spy = provider.getLogs;
        yield parser.parse(() => { });
        sandbox.assert.calledWith(spy.getCall(0), { address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C', fromBlock: 10, toBlock: 14 });
        sandbox.assert.calledWith(spy.getCall(1), { address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C', fromBlock: 15, toBlock: 19 });
        sandbox.assert.calledWith(spy.getCall(2), { address: '0x8E095D160C1056Dca391C076107C5df4E184aE0C', fromBlock: 20, toBlock: 20 });
    }));
    it('Should call provider.getBlock at once then gets same block numbers (check memoization)', () => __awaiter(void 0, void 0, void 0, function* () {
        const spy = provider.getBlock;
        yield parser.parse(() => { });
        sandbox.assert.calledOnce(spy);
    }));
    it('Should  load transaction if @loadValue is true', () => __awaiter(void 0, void 0, void 0, function* () {
        const spy = provider.getTransaction;
        parser = new index_1.default(Object.assign(Object.assign({}, cfg), { provider, loadValue: true }));
        yield parser.parse(() => { });
        sandbox.assert.calledThrice(spy);
    }));
    it('Should not load transaction from network only if param @loadValue is false ', () => __awaiter(void 0, void 0, void 0, function* () {
        const spy = provider.getTransaction;
        parser = new index_1.default(Object.assign(Object.assign({}, cfg), { provider, loadValue: false }));
        yield parser.parse(() => { });
        sandbox.assert.notCalled(spy);
    }));
    it('Should split a large logs into parts and parse them consistently', () => __awaiter(void 0, void 0, void 0, function* () {
        const testLog = [...Array(150).keys()];
        provider.getLogs.returns(testLog);
        sandbox.stub(parser, '_decode').callsFake((l) => l);
        const promiseSpy = sandbox.spy(Promise, 'all');
        yield parser._parse(1, 1);
        sandbox.assert.calledWith(promiseSpy, testLog.slice(0, 100));
        sandbox.assert.calledWith(promiseSpy, testLog.slice(100, 150));
    }));
});
