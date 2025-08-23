# Project Rules

These rules define the branching strategy, review process, commit message conventions, naming conventions, and coding standards for our software engineering course project.

---

## 1. Branching Strategy

1. **Master Branch**
   - `master` is the **production branch**.
   - The default `main` branch should be deleted to avoid confusion.

2. **Develop Branch**
   - `develop` will contain all the **latest stable changes**.
   - All tests must pass on this branch at all times.
   - The branch should always remain in a **deployable state**.

3. **Feature Branches**
   - Each story or task must be developed in a dedicated **feature branch**.
   - Name of feature branch must be following the convention as `feature/SE04-<number>`.
   - All branches for both tasks and features must follow the **feature branch** naming convention and be created as `feature/...`.
   - Code must be:
     - Well-structured and easy to understand.
     - Implemented with proper tests.
     - Following **SOLID principles** and/or relevant **design patterns** where possible.

---

## 2. Code Reviews

1. **Review Requirement**
   - Every feature branch must be reviewed by at least **two team members** before merging into `develop`.

2. **Review Guidelines**
   - Reviewers should leave **constructive comments** on pull requests.
   - All tests related to the feature must be implemented and passing before approval.
   - Do not wait until the entire story is complete to request a review:
     - Open a pull request as soon as a **good portion of coding is done**, enabling early feedback.

---

## 3. Commit Messages

1. **Format**
   - Commit messages must always follow the format:  
     ```
     STORY-<number> <Future tense message>
     ```
   - Do not put full stop at the end of the commit message.
   - Example:  
     ```
     SE04-1 Add form functionality to create a new user
     ```

2. **Guidelines**
   - Always use **future tense** (e.g., "Add", "Fix", "Implement") to indicate what the commit will achieve.
   - Messages should be descriptive enough to explain the **purpose of the change**.
   - This ensures clarity during rebasing, debugging, or when tracing features/bugs in the Git history.

---

## 4. Naming Conventions

1. **Variables & Functions**
   - Use **camelCase**.  
     Example: `userName`, `calculateTotal`.

2. **Classes**
   - Use **StartCase (PascalCase)**.  
     Example: `UserProfile`, `PaymentGateway`.

3. **CSS**
   - **Classes**: Use **kebab-case** (words separated by `-`).  
     Example: `form-container`, `btn-primary`.
   - **IDs**: Use **camelCase**.  
     Example: `userForm`, `navBar`.

4. **General Naming Rules**
   - Always use **descriptive names** that clearly explain the purpose of the variable, function, or class.  
   - Never use meaningless names like `a`, `x`, `temp`, etc.  
   - Poor naming will result in a **code review comment**.  
   - Be mindful and consistent while naming identifiers.

---

## 5. Testing & Quality
- All branches must include **properly written unit tests**.
- Code should follow clean coding practices.
- Ensure changes do not break existing functionality.

---

## 6. General Principles
- Collaboration and transparency are encouraged through frequent commits and early PRs.
- Everyone is responsible for maintaining project stability and quality.
