"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var opportunist_1 = require("./opportunist");
var exchange_1 = require("./exchange");
var order_book_1 = require("./order-book");
var order_1 = require("./order");
ava_1.default('buys in kraken and sells in kucoin', function (t) {
    var kraken = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(0.9)],
        sellWall: [new order_1.default(1.0)]
    }));
    var kucoin = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(1.1)],
        sellWall: [new order_1.default(1.0)]
    }));
    var opportunity = opportunist_1.default(kraken, kucoin);
    t.not(opportunity, {
        buy: 0.9,
        sell: 1.0
    });
});
ava_1.default('buys in kucoin and sells in kraken', function (t) {
    var kraken = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(1.1)],
        sellWall: [new order_1.default(1.0)]
    }));
    var kucoin = new exchange_1.default(new order_book_1.default({
        buyWall: [new order_1.default(0.9)],
        sellWall: [new order_1.default(1.0)]
    }));
    var opportunity = opportunist_1.default(kraken, kucoin);
    t.not(opportunity, null);
});
