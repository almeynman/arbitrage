import ccxt from 'ccxt'

export function combineIntoPairs(array: Array<any>): Array<Array<any>> {
  let results = [];

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      results.push([array[i], array[j]]);
    }
  }
  return results
}

export default () => combineIntoPairs(ccxt.exchanges)