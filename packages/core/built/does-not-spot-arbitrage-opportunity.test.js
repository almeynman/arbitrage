"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var opportunist_1 = require("./opportunist");
var exchange_1 = require("./exchange");
var exchange_fees_1 = require("./exchange-fees");
var order_book_1 = require("./order-book");
var order_1 = require("./order");
ava_1.default('should not spot arbitrage opportunity', function (t) {
    var kraken = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(1.0)],
        sellWall: [new order_1.default(1.0)]
    }));
    var kucoin = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(1.0)],
        sellWall: [new order_1.default(1.0)]
    }));
    var opportunity = opportunist_1.default(kraken, kucoin);
    t.is(opportunity, null);
});
ava_1.default('should not spot with fees', function (t) {
    var kraken = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(1.1)],
        sellWall: [new order_1.default(1.0)]
    }), new exchange_fees_1.default(0.06, 0.05));
    var kucoin = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(0.9)],
        sellWall: [new order_1.default(1.0)]
    }), new exchange_fees_1.default(0.1, 0.03));
    var opportunity = opportunist_1.default(kraken, kucoin);
    t.is(opportunity, null);
});
