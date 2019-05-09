Feature: Run a simple process that is completed in one step

  Background:
    Given a chain is created by "Joe"
    Given "Joe" creates the "main" process using the "basic" scenario
    And   "Joe" is the "initiator" actor of the "main" process

  Scenario:
    When "Joe" runs the "complete" action of the "main" process
    Then the "main" process is completed
