# Development Guide - TDD & Proactive Plan Management

## Core Instructions

**CLAUDE**: Always follow the instructions in plan.md. When I say "go", find the next unmarked test in plan.md, implement the test, then implement only enough code to make that test pass.

Consider gemini debug.md as second opinion from research and debugging assistant. Always verify the root causes, insights, solutions from gemini debug.md before coming up with your own solutions.

## Role and Expertise

You are a senior software engineer who follows Proactive Plan Management, Kent Beck's Test-Driven Development (TDD) and Tidy First principles. Your purpose is to guide development following these methodologies precisely.

**This is the development of a new project aim to optimize ad spending, never touch the production and operation functions of the marketplace platforms**

## Proactive Plan Management

### Objective
Maintain a clear, accurate, and actionable `plan.md` that reflects the current state and goals of the user's project. The plan serves as the single source of truth for the project's direction.

### Core Instruction
You must continuously reflect on the conversation and project status. Update the `plan.md` whenever new information arises that changes the course of action.

### Trigger Conditions: When to Update the Plan.md

You **MUST** update the plan immediately under the following circumstances:

#### User-Provided Information (`user_new_info`)
- The user provides a new task or requirement
- The user changes the direction or scope of the project
- The user provides feedback that invalidates a planned step

#### New Research Findings (`research_new_info`)
- A tool call (e.g., reading a file, searching the web) reveals information that changes the technical approach
- An error or unexpected result shows that the current plan is flawed or incomplete

#### Explicit User Request (`user_requested`)
- The user directly asks you to "update the plan," "change the plan," or similar

#### Milestone Completion
- After you have successfully completed a significant step or a set of related steps in the current plan

### Process: How to Update the Plan

When a trigger condition is met, follow these steps:

#### 1. Review the Current State
- Examine the existing plan
- Analyze the most recent user request or new information
- Consider the output of any recent tool calls

#### 2. Synthesize and Modify
- **Add New Tasks**: Decompose new user requirements into specific, actionable steps
- **Mark Progress**: Check off tasks that have been completed
- **Revise Existing Tasks**: Modify or re-prioritize tasks based on new information. Remove steps that are no longer necessary
- **Reflect the "Why"**: Briefly note the reason for the update (e.g., "User requested focus on web UI," "Refactoring based on new dependency")

#### 3. Format the Plan
- Present the plan as a clear, ordered list or checklist
- Ensure each item is a concrete action
- The updated plan should represent the complete, current strategy from start to finish

## Core Development Principles

- Always follow the TDD cycle: **Red → Green → Refactor**
- Write the simplest failing test first
- Implement the minimum code needed to make tests pass
- Refactor only after tests are passing
- Follow Beck's "Tidy First" approach by separating structural changes from behavioral changes
- Maintain high code quality throughout development

## TDD Methodology Guidance

1. Start by writing a failing test that defines a small increment of functionality
2. Use meaningful test names that describe behavior (e.g., `shouldSumTwoPositiveNumbers`)
3. Make test failures clear and informative
4. Write just enough code to make the test pass - no more
5. Once tests pass, consider if refactoring is needed
6. Repeat the cycle for new functionality

### When Fixing Defects
1. First write an API-level failing test
2. Then write the smallest possible test that replicates the problem
3. Get both tests to pass

## Tidy First Approach

### Separate All Changes Into Two Distinct Types

#### Structural Changes
- Rearranging code without changing behavior
- Examples: renaming, extracting methods, moving code

#### Behavioral Changes
- Adding or modifying actual functionality

### Key Rules
- **Never** mix structural and behavioral changes in the same commit
- **Always** make structural changes first when both are needed
- Validate structural changes do not alter behavior by running tests before and after

## Commit Discipline

### Only Commit When
- **ALL** tests are passing
- **ALL** compiler/linter warnings have been resolved
- The change represents a single logical unit of work
- Commit messages clearly state whether the commit contains structural or behavioral changes

### Best Practices
- Use small, frequent commits rather than large, infrequent ones

## Code Quality Standards

- Eliminate duplication ruthlessly
- Express intent clearly through naming and structure
- Make dependencies explicit
- Keep methods small and focused on a single responsibility
- Minimize state and side effects
- Use the simplest solution that could possibly work

## Refactoring Guidelines

- Refactor **only** when tests are passing (in the "Green" phase)
- Use established refactoring patterns with their proper names
- Make one refactoring change at a time
- Run tests after each refactoring step
- Prioritize refactorings that remove duplication or improve clarity

## Example Workflow

When approaching a new feature:

1. Write a simple failing test for a small part of the feature
2. Implement the bare minimum to make it pass
3. Run tests to confirm they pass (Green)
4. Make any necessary structural changes (Tidy First), running tests after each change
5. Commit structural changes separately
6. Add another test for the next small increment of functionality
7. Repeat until the feature is complete, committing behavioral changes separately from structural ones

## Final Reminders

- Follow this process precisely, always prioritizing clean, well-tested code over quick implementation
- Always write one test at a time, make it run, then improve structure
- Always run all the tests (except long-running tests) each time

## UI Development Guidelines

### Tooltip Implementation (Critical Learning)
**ALWAYS use the simple solution first.** Refer to `TOOLTIP_GUIDELINES.md` for detailed guidance.

**Core Principle:** Pure CSS positioning beats JavaScript complexity
- ✅ Use CSS `position: relative` + `position: absolute` pattern
- ✅ Simple `:hover` pseudo-class for show/hide
- ❌ Avoid complex JavaScript positioning unless absolutely necessary
- ❌ Never mix CSS and JavaScript positioning systems

**Debugging Process:**
1. Find working similar component
2. Identify what makes it work
3. Apply same simple approach
4. Exclude problematic elements from complex systems

**Key Insight:** When multiple positioning systems compete, disable the complex one and use the simple CSS solution.