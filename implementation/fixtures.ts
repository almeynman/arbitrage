export class AnExchange {
  public async loadMarkets() {}
  public async fetchOrderBook(symbol: string): Promise<any> {
      return {
          bids: [
              [
                  0.9,
                  1
              ],
              [
                  0.8,
                  2
              ]
          ],
          asks: [
              [
                  1,
                  1
              ],
              [
                  2,
                  2
              ]
          ]
      }
  }
}
