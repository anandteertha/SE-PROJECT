@cart @core
Feature: Manage Shopping Cart
  As a NutriBite user,
  I want to view and manage my cart items,
  so that I can adjust my order before checking out.

  Background:
    Given I am a logged-in user
    And my cart contains "2" "Classic Burgers" and "1" "Diet Coke"
    And I am on the "/cart" page

  @cart-view
  Scenario: View Items and Totals in Cart
    When I land on the cart page
    Then I should see an item named "Classic Burger" with quantity "2"
    And I should see the price for "Classic Burger"
    And I should see an item named "Diet Coke" with quantity "1"
    And I should see the price for "Diet Coke"
    And I should see the cart's grand total price
    And I should see the cart's total calorie count

  @cart-update @happy-path
  Scenario: Increase Item Quantity
    Given I am on the "/cart" page
    When I increase the quantity of "Classic Burger" to "3"
    Then the "Classic Burger" item total price should update
    And the cart's grand total price should recalculate and increase
    And the cart's total nutrition information should update

  @cart-update @happy-path
  Scenario: Decrease Item Quantity
    Given I am on the "/cart" page
    When I decrease the quantity of "Classic Burger" to "1"
    Then the "Classic Burger" item total price should update
    And the cart's grand total price should recalculate and decrease

  @cart-delete @happy-path
  Scenario: Remove an Item from Cart
    Given I am on the "/cart" page
    When I click the "Remove" button for "Diet Coke"
    Then I should no longer see "Diet Coke" in my cart
    And the cart's grand total price should recalculate

  @cart-checkout @navigation
  Scenario: Proceed to Checkout with Items
    Given I am on the "/cart" page
    And the "Checkout" button is enabled
    When I click the "Checkout" button
    Then I should be redirected to the "/checkout" page

  @cart-checkout @empty-state
  Scenario: Checkout Button is Disabled When Cart is Empty
    Given I am a logged-in user
    And my cart is empty
    When I navigate to the "/cart" page
    Then I should see a message "Your cart is empty"
    And the "Checkout" button should be disabled