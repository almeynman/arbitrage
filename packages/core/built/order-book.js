"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderBook = /** @class */ (function () {
    function OrderBook(args) {
        this.buyWall = args.buyWall;
        this.sellWall = args.sellWall;
    }
    OrderBook.prototype.getBestBuyPrice = function () {
        return this.buyWall[0].price;
    };
    OrderBook.prototype.getBestSellPrice = function () {
        return this.sellWall[0].price;
    };
    return OrderBook;
}());
exports.default = OrderBook;
