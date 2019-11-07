export interface ExchangeFees {
  takerFee: number
}

interface CreateExchangeFeesArgs {
  takerFee?: number
}

export const createExchangeFees = ({ takerFee = 0.0026 }: CreateExchangeFeesArgs): ExchangeFees => ({
  takerFee
})
