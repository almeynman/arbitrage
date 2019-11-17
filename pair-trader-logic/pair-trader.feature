Feature: PairTrader

Scenario: PairTrader opens a trade
    Given the Assessment is an OpenOpportunity
    Given there is funds to buy on exchane 1
    Given there is funds to sell on exchange 2
    When I open a trade
    Then I should get buy order from exchange 1
    Then I should get sell order from exchange 2
