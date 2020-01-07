Feature: Trader
  Trader is responsible for opening and closing trades given opportunity.
  The bid price is what buyers are willing to pay for it.
  The ask price is what sellers are willing to take for it.

  Scenario: Opens a trader
    Given an opporunity
    When trader is called
    Then opens a trade
