const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const exchangeId = 'kraken'
const symbol = 'BTC/USD'

;(async function main() {
  let array = ["apple", "banana", "lemon", "mango"];
  let results = [];

  // Since you only want pairs, there's no reason
  // to iterate over the last element directly
  for (let i = 0; i < array.length - 1; i++) {
    // This is where you'll capture that last value
    for (let j = i + 1; j < array.length; j++) {
      results.push(`${array[i]} ${array[j]}`);
    }
  }

  console.log(results);
  console.log(perm([1,2,3]).join("\n"))

  // fs.writeFileSync(`./scripts/ccxt/all-exchanges-by-pairs.ignore.json`, stringify(closedOrders))
})()
