Feature: Spotter
  Spotter is responsible for spotting opportunities.

  Scenario: Opens a trader
    Given an opporunity
    When trader is called
    Then opens a trade
