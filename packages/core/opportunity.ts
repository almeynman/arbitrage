interface Opportunity {
    symbol: string,
    coeficient: number,
    buy: OpportunityExchangeDetail,
    sell: OpportunityExchangeDetail
}

interface OpportunityExchangeDetail {
    exchange: string,
    price: number,
    expectedFee: number,
}

export default Opportunity