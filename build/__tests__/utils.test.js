"use strict";
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
const chai_1 = require("chai");
const utils_1 = require("../cmd/utils");
const eventHash_json_1 = __importDefault(require("./fixture/eventHash.json"));
it('util.extractEventData()', () => __awaiter(void 0, void 0, void 0, function* () {
    const tmpl = {
        dragonId: {
            "type": "BigNumber",
            "hex": "0x18db"
        },
        eggId: {
            "type": "BigNumber",
            "hex": "0x05ab"
        },
        parent1Id: {
            "type": "BigNumber",
            "hex": "0x00"
        },
        parent2Id: {
            "type": "BigNumber",
            "hex": "0x00"
        },
        generation: {
            "type": "BigNumber",
            "hex": "0x01"
        },
        genes: {
            "type": "BigNumber",
            "hex": "0x0c5080425b8d25c5"
        },
        t: 1,
        creator: "0xaaE9DF0F50D53f9AC50651bF69590aB7b1091451",
        to: "0xfe3fdbE9e3EA3F11Fe976010028eDfA33A383644"
    };
    (0, chai_1.expect)((0, utils_1.extractEventData)(eventHash_json_1.default)).to.eql(tmpl);
}));
it('util.safePromise', () => {
});
