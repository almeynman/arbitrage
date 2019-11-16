Scenario: PairTrader opens a trade
    Given the Assessment is an OpenOpportunity // OpenOpportunity is determined by historic exchange price difference for given currency
    Given there is funds to buy on exchane 1
    Given there is funds to sell on exchange 2
    When I open a trade
    Then I should get buy order from exchange 1
    Then I should get sell order from exchange 2

Scenario: PairTrader closes a trade
    Given an open trade
    Given the Assessment is a CloseOpportunity // CloseOpportunity is determined of OpenOpportunity
    Given the coefficient is strictly less than 1



    Given the Assessment is an Opportunity
    Given there is funds to buy on exchane 1
    Given there is funds to sell on exchange 2
    When I open a trade
    Then I should get buy order from exchange 1
    Then I should get sell order from exchange 2



