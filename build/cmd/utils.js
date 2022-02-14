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
Object.defineProperty(exports, "__esModule", { value: true });
exports.safePromise = exports.extractEventData = void 0;
function extractEventData(event) {
    return event.eventFragment.inputs.map(e => e.name).reduce((res, prop) => {
        res[prop] = event.args[prop];
        return res;
    }, {});
}
exports.extractEventData = extractEventData;
function safePromise(promiseFn, attempt = 3, __i = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield promiseFn();
        }
        catch (e) {
            if (__i < attempt) {
                console.warn(`Bad request. Retry ${__i + 1}. Message: ${e.message}`);
                return safePromise(promiseFn, attempt, ++__i);
            }
            else {
                throw new Error(e.message);
            }
        }
    });
}
exports.safePromise = safePromise;
