"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exchange_fees_1 = require("./exchange-fees");
var Exchange = /** @class */ (function () {
    function Exchange(orderBook, fees) {
        if (fees === void 0) { fees = new exchange_fees_1.default(0, 0); }
        this.orderBook = orderBook;
        this.fees = fees;
    }
    Exchange.prototype.getBuyCost = function () {
        var buyPrice = this.orderBook.getBestBuyPrice();
        return buyPrice + this.fees.buy * buyPrice;
    };
    Exchange.prototype.getSellCost = function () {
        var sellPrice = this.orderBook.getBestSellPrice();
        return sellPrice - this.fees.sell * sellPrice;
    };
    return Exchange;
}());
exports.default = Exchange;
