@menu
Feature: View Restaurant Menu
  As a customer of NutriBite,
  I can view the restaurant’s menu items
  so that I can browse and select food to purchase.

  Background:
    Given I am a logged-in user
    And I am on the "/home" page

  @core @ui
  Scenario: View Menu Items as Cards
    Given the menu has items "Menu Item A" and "Menu Item B"
    When I land on the page
    Then I should see a card for "Menu Item A"
    And I should see a card for "Menu Item B"
    And each card should display the item's name, image, and price

  @search
  Scenario: Search for a Specific Item
    Given the menu contains "Savory Dish One" and "Sweet Dish Two"
    When I type "Burger" into the search bar
    Then I should see the "Savory Dish One" card
    But I should not see the "Sweet Dish Two" card

  @filter
  Scenario: Filter Menu by Category
    Given the menu has a "Drinks" category and a "Main Courses" category
    When I select the "Drinks" filter
    Then I should see all items from the "Drinks" category
    But I should not see any items from the "Main Courses" category

  @cart @core
  Scenario: Add Item to Cart from Menu
    Given I see the "Savory Dish One" item card
    When I click the "Add to Cart" button on the "Savory Dish One" card
    Then my cart total should update to show "1" item

  @cart
  Scenario: Remove Item from Cart from Menu
    Given I have "1" "Savory Dish One" in my cart
    And I am on the "/home" page
    When I click the "Remove" button on the "Savory Dish One" card
    Then my cart total should update to show "0" items

  @ui @darkmode
  Scenario: Toggle Light and Dark Mode
    Given the app is in light mode
    When I click the "dark mode" toggle button
    Then the page background should change to a dark color
    And the menu cards should change to a dark theme

  @search @empty_state
  Scenario: Search With No Results
    Given the menu contains "Savory Dish One"
    When I type "XYZ-non-existent-food" into the search bar
    Then I should not see any menu item cards
    And I should see a message "No items match your search"

  @navigation
  Scenario: View Item Details
    Given I am on the "/home" page
    And I see the "Savory Dish One" item card
    When I click on the "Savory Dish One" item card
    Then I should be redirected to the "/item/savory-dish-one" page
    And I should see the full description and nutritional details for "Savory Dish One"

  @cart
  Scenario: Update Item Quantity from Menu
    Given I have "1" "Savory Dish One" in my cart
    And I am on the "/home" page
    When I click the "+" (increase quantity) button on the "Savory Dish One" card
    Then my cart total should update to show "2" items
    When I click the "-" (decrease quantity) button on the "Savory Dish One" card
    Then my cart total should update to show "1" item

  @filter
  Scenario: Clear All Filters
    Given I have filtered the menu by the "Drinks" category
    And I see "0" items from the "Main Courses" category
    When I click the "Clear Filters" button
    Then I should see items from the "Main Courses" category
    And I should see items from the "Drinks" category