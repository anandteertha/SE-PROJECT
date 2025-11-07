@authentication
Feature: User Authentication for Nutribite
  As a customer, I want to register and log in
  so I can access my account and buy food.

  @register @core
  Scenario: Successful New User Registration
    Given I am on the "/register" page
    When I fill in "Name" with "Test User"
    And I fill in "Username" with "testuser1"
    And I fill in "E-mail" with "test@example.com"
    And I fill in "Password" with "StrongP@ss123"
    And I fill in "Confirm password" with "StrongP@ss123"
    And I check "I agree terms & conditions"
    And I click the "Sign up" button
    Then I should be redirected to the "/login" page
    And I should see "User testuser1 registered successfully"

  @login @core
  Scenario: Successful Login with Email
    Given I am a registered user with email "george@gmail.com" and password "Password123!"
    And I am on the "/login" page
    When I fill in "Username or E-mail" with "george@gmail.com"
    And I fill in "Password" with "Password123!"
    And I click the "Sign in" button
    Then I should be redirected to the "/home" page
    And I should see the "Logout" button

  @login @core
  Scenario: Successful Login with Username
    Given I am a registered user with username "george" and password "Password123!"
    And I am on the "/login" page
    When I fill in "Username or E-mail" with "george"
    And I fill in "Password" with "Password123!"
    And I click the "Sign in" button
    Then I should be redirected to the "/home" page
    And I should see the "Logout" button

  @login @validation @security
  Scenario: Failed Login (Invalid Password)
    Given I am on the "/login" page
    When I fill in "Username or E-mail" with "george@gmail.com"
    And I fill in "Password" with "WrongPassword!"
    And I click the "Sign in" button
    Then I should remain on the "/login" page
    And I should see an error message "Invalid username or password"

  @login @validation
  Scenario: Failed Login (Non-existent User)
    Given I am on the "/login" page
    When I fill in "Username or E-mail" with "nobody@example.com"
    And I fill in "Password" with "Password123!"
    And I click the "Sign in" button
    Then I should remain on the "/login" page
    And I should see an error message "Invalid username or password"

  @logout @core
  Scenario: User Logout
    Given I am logged in
    When I click the "Logout" button
    Then I should be redirected to the "/login" page
    And I should see the "Login" button

  @register @validation @security
  Scenario Outline: Failed Registration (Weak Password)
    Given I am on the "/register" page
    When I fill in "Name" with "Test User"
    And I fill in "Username" with "testuser2"
    And I fill in "E-Example" with "test2@example.com"
    And I fill in "Password" with "<password>"
    And I check "I agree terms & conditions"
    Then the "Sign up" button should be disabled
    And I should see an error message "<error_message>"

    Examples:
      | password       | error_message                                           |
      | "pass"         | "Must be at least 10 characters long."                  |
      | "password123!" | "Must contain uppercase, lowercase, number, & special character." |
      | "PASSWORD123!" | "Must contain uppercase, lowercase, number, & special character." |
      | "Password123"  | "Must contain uppercase, lowercase, number, & special character." |

  @register @validation
  Scenario: Failed Registration (Password Mismatch)
    Given I am on the "/register" page
    When I fill in "Name" with "Jane Doe"
    And I fill in "Username" with "janedoe"
    And I fill in "E-mail" with "jane@example.com"
    And I fill in "Password" with "StrongP@ss123"
    And I fill in "Confirm password" with "DIFFERENTP@ss123"
    And I check "I agree terms & conditions"
    Then I should see an error message "Passwords do not match."
    And the "Sign up" button should be disabled

  @register @validation
  Scenario: Failed Registration (Email Already Exists)
    Given a user with the email "george@gmail.com" already exists
    And I am on the "/register" page
    When I fill in "Name" with "Another George"
    And I fill in "Username" with "george2"
    And I fill in "E-mail" with "george@gmail.com"
    And I fill in "Password" with "Password123!"
    And I fill in "Confirm password" with "Password123!"
    And I check "I agree terms & conditions"
    And I click the "Sign up" button
    Then I should remain on the "/register" page
    And I should see an error message "Failed to register user. Email may already exist."

  @register @validation
  Scenario: Failed Registration (Terms and Conditions Not Accepted)
    Given I am on the "/register" page
    When I fill in "Name" with "Test User"
    And I fill in "Username" with "testuser3"
    And I fill in "E-mail" with "test3@example.com"
    And I fill in "Password" with "StrongP@ss123"
    And I fill in "Confirm password" with "StrongP@ss123"
    But I do not check "I agree terms & conditions"
    Then the "Sign up" button should be disabled