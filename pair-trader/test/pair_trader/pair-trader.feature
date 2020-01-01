Feature: Pair trader

  Pair trader is responsible for managing trades given opportunities.
  The bid price is what buyers are willing to pay for it.
  The ask price is what sellers are willing to take for it.

  Scenario: opens a trade
    Given an asset pair
    And an exchange pair
    And one exchange has positive balance in first asset
    And the other exchange has positive balance in second asset
    When an opportunity occurs
    Then a buy order is placed on one exchange
#    And a sell order is placed on the other exchange
#    And buy price including fees is lower than sell price including fees
#    And arbitrage coefficient including fees should be greater than one

  Scenario: opens a trade
    Given 2 exchanges with same market
    And can buy in one exchange
    And can sell in the other exchange
    And an opportunity
    Then a buy order is placed on one exchange
    And a sell order is placed on the other exchange
#    And a sell order is placed on the other exchange
#    And buy price including fees is lower than sell price including fees
#    And arbitrage coefficient including fees should be greater than one
