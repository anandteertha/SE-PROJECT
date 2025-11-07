Feature: SE04-7 View Menu page behaviors
  As a user, I want to browse the menu, search and filter items, and manage my cart.

  Background:
    Given the backend is stubbed
    And I visit the menu page

  Scenario: Load menu shows items
    Then at least 3 menu cards are visible

  Scenario: Search by name matches a single item
    When I type "Quinoa" in the search bar
    Then I should see 1 menu cards

  Scenario: Search by description works
    When I type "multigrain" in the search bar
    Then I should see 1 menu cards

  Scenario: Search by diet type works
    When I type "Vegetarian" in the search bar
    Then I should see 3 menu cards

  Scenario: Clear search resets results
    When I type "Wrap" in the search bar
    And I clear the search bar
    Then at least 3 menu cards are visible

  Scenario: Open filters panel
    When I open the filters panel
    Then the filters trigger aria-expanded is "true"

  Scenario: Close filters panel
    When I open the filters panel
    And I close the filters panel
    Then the filters trigger aria-expanded is "false"

  Scenario: Filter by category Breakfast
    When I open the filters panel
    And I select category "Breakfast"
    And I apply filters
    Then I should see 2 menu cards

  Scenario: Filter by category Snacks
    When I open the filters panel
    And I select category "Snacks"
    And I apply filters
    Then I should see 1 menu cards

  Scenario: Filter by diet Vegan
    When I open the filters panel
    And I select dietary preference "Vegan"
    And I apply filters
    Then I should see 1 menu cards

  Scenario: Filter by diet Vegetarian
    When I open the filters panel
    And I select dietary preference "Vegetarian"
    And I apply filters
    Then I should see 2 menu cards

  Scenario: Adjust spiciness triggers update
    When I open the filters panel
    And I set spiciness to 7
    And I apply filters
    Then a user preferences update is sent

  Scenario: Adjust sweetness triggers update
    When I open the filters panel
    And I set sweetness to 3
    And I apply filters
    Then a user preferences update is sent

  Scenario: Set salt to less
    When I open the filters panel
    And I set salt level to "less"
    And I apply filters
    Then a user preferences update is sent

  Scenario: Reset filters closes panel
    When I open the filters panel
    And I reset filters
    Then the filters trigger aria-expanded is "false"

  Scenario: Dark mode toggles on
    When I toggle dark mode
    Then dark mode is "on"

  Scenario: Dark mode toggles off
    When I toggle dark mode
    And I toggle dark mode
    Then dark mode is "off"

  Scenario: Add to cart increments badge
    When I add the first item to the cart
    Then the cart badge shows 2

  Scenario: Remove from cart decrements badge
    When I add the first item to the cart
    And I remove the first item from the cart
    Then the cart badge shows 1

  Scenario: Add to cart sends API
    When I add the first item to the cart
    Then a cart update is sent with quantity 1 for item id 1

  Scenario: Remove to zero does not go negative
    When I add the first item to the cart
    And I remove the first item from the cart
    And I remove the first item from the cart
    Then the cart badge shows 1

  Scenario: Cart badge bounces
    When I add the first item to the cart
    Then the cart badge bounces briefly

  Scenario: Logged out shows Guest
    Then the profile shows "Guest"

  Scenario: Logged in shows email name
    Given a logged in user "bob@example.com"
    And I visit the menu page
    Then the profile shows "bob"

  Scenario: Categories are rendered in filter panel
    When I open the filters panel
    Then I see at least one "Categories" filter option

  Scenario: Dietary preferences are rendered in filter panel
    When I open the filters panel
    Then I see at least one "Dietary Preferences" filter option

  Scenario: Spiciness bubble reflects value
    When I open the filters panel
    And I set spiciness to 9
    Then the spiciness bubble reflects 9

  Scenario: Sweetness bubble reflects value
    When I open the filters panel
    And I set sweetness to 2
    Then the sweetness bubble reflects 2

  Scenario: Search is case-insensitive
    When I type "qUInoA" in the search bar
    Then I should see 1 menu cards

  Scenario: Search matches description case-insensitively
    When I type "GrIlLeD" in the search bar
    Then I should see 1 menu cards

  Scenario: Multiple adds accumulate
    When I add the first item to the cart
    And I add the first item to the cart
    Then the cart badge shows 3

  Scenario: Add then remove keeps correct count
    When I add the first item to the cart
    And I add the first item to the cart
    And I remove the first item from the cart
    Then the cart badge shows 2
