@preferences @filter
Feature: User Food Preferences
  As a NutriBite user,
  I can set my dietary, taste, and nutritional preferences
  so that I will be able to see a filtered menu.

  Background:
    Given I am a logged-in user

  @core @ui
  Scenario: View and Access the Settings Page
    Given I am on the "/home" page
    When I navigate to the "/settings" page
    Then I should see a section titled "Dietary Preferences"
    And I should see a slider for "Spiciness"
    And I should see a slider for "Sweetness"
    And I should see options for "Salt Level"
    And I should see an input field for "Max Calorie Count"

  @core @preferences-update
  Scenario: Set Dietary Preferences
    Given I am on the "/settings" page
    When I select "Vegan" from the "Dietary Preferences"
    And I click the "Save Preferences" button
    And I navigate to the "/home" page (menu-list)
    Then I should only see menu items marked as "Vegan"
    But I should not see menu items marked as "Non-vegetarian"

  @preferences-update
  Scenario: Set Spiciness Level
    Given I am on the "/settings" page
    When I set the "Spiciness" slider to "Low" (e.g., 3/10)
    And I click the "Save Preferences" button
    And I navigate to the "/home" page (menu-list)
    Then I should only see menu items with a "Spiciness" of 3 or less

  @preferences-update
  Scenario: Set Calorie Count
    Given I am on the "/settings" page
    When I enter "500" into the "Max Calorie Count" field
    And I click the "Save Preferences" button
    And I navigate to the "/home" page (menu-list)
    Then I should only see menu items with "500" calories or less
    But I should not see menu items with "800" calories

  @preferences-update
  Scenario: Combine Multiple Filters
    Given I am on the "/settings" page
    When I select "Vegetarian" from the "Dietary Preferences"
    And I set the "Spiciness" slider to "Medium" (e.g., 5/10)
    And I click the "Save Preferences" button
    And I navigate to the "/home" page (menu-list)
    Then I should see items that are "Vegetarian" AND have a "Spiciness" of 5 or less
    But I should not see any "Vegan" items
    And I should not see any "Vegetarian" items with a "Spiciness" of 8

  @preferences-reset
  Scenario: Clear or Reset Preferences
    Given I have set my "Dietary Preference" to "Vegan"
    And I am on the "/settings" page
    When I click the "Reset to Default" button
    And I click the "Save Preferences" button
    And I navigate to the "/home" page (menu-list)
    Then I should see both "Vegan" and "Non-vegetarian" menu items