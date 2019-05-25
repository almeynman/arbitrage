"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function opportunist(exchange1, exchange2) {
    if (isOpportunity(exchange1, exchange2)) {
        return {};
    }
    if (isOpportunity(exchange2, exchange1)) {
        return {};
    }
    return null;
}
exports.default = opportunist;
function isOpportunity(exchange1, exchange2) {
    return exchange1.getBuyCost() < exchange2.getSellCost();
}
