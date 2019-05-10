Feature: Two actors meet. The recipient is not doing well.

  Background:
    Given a chain is created by "Joe"
    Given "Joe" creates the "main" process using the "handshake" scenario
    And   "Joe" is the "initiator" actor of the "main" process
    And   "Jane" is the "recipient" actor of the "main" process
    When "Joe" runs the "greet" action of the "main" process
    Then the "main" process is in the "wait_on_recipient" state

  Scenario:
    When "Jane" runs the "reply" action of the "main" process giving a "not_good" response
    Then the "main" process is in the "expect_sympathy" state
    When "Joe" runs the "complete" action of the "main" process
    Then the "main" process is completed

  Scenario:
    When "Jane" runs the "reply" action of the "main" process giving a "not_good" response
    Then the "main" process is in the "expect_sympathy" state

    When "Joe" runs the "sympathize" action of the "main" process
    Then the "main" process is in the "recipient_can_elaborate" state
    When "Jane" runs the "elaborate" action of the "main" process with:
      | reason | My cat is stealing my boyfriend. |
    Then the "main" process is in the "expect_sympathy" state

    When "Joe" runs the "complete" action of the "main" process
    Then the "main" process is completed

  Scenario:
    When "Jane" runs the "reply" action of the "main" process giving a "not_good" response
    Then the "main" process is in the "expect_sympathy" state

    When "Joe" runs the "sympathize" action of the "main" process
    Then the "main" process is in the "recipient_can_elaborate" state
    When "Jane" runs the "elaborate" action of the "main" process with:
      | reason | My cat is stealing my boyfriend. |
    Then the "main" process is in the "expect_sympathy" state

    When "Joe" runs the "sympathize" action of the "main" process
    Then the "main" process is in the "recipient_can_elaborate" state
    When "Jane" runs the "elaborate" action of the "main" process with:
      | reason | She always comes in to cuddle with him. |
    Then the "main" process is in the "expect_sympathy" state

    When "Joe" runs the "sympathize" action of the "main" process
    Then the "main" process is in the "recipient_can_elaborate" state
    When "Jane" runs the "elaborate" action of the "main" process with:
      | reason | Misty has a mean purr. I know it's to taunt me. |
    Then the "main" process is in the "expect_sympathy" state

    When "Joe" runs the "complete" action of the "main" process
    Then the "main" process is completed   
