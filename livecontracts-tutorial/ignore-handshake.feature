Feature: Two actors greet each other

  Background:
    Given a chain is created by "Joe"
    Given "Joe" creates the "main" process using the "handshake" scenario
    And   "Joe" is the "initiator" actor of the "main" process
    And   "Jane" is the "recipient" actor of the "main" process

  Scenario:
    When "Joe" runs the "greet" action of the "main" process
    Then the "main" process is in the "wait_on_recipient" state
    When "Jane" runs the "reply" action of the "main" process
    Then the "main" process is in the "wait_on_initiator" state
    When "Joe" runs the "complete" action of the "main" process
    Then the "main" process is completed

  Scenario:
    When "Joe" runs the "greet" action of the "main" process
    Then the "main" process is in the "wait_on_recipient" state
    When "Jane" runs the "ignore" action of the "main" process
    Then the "main" process is cancelled
