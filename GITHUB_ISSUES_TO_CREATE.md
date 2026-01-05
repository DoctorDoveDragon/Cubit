# GitHub Issues to Create

This file documents GitHub issues that should be created to track TODOs in the codebase.

## Issue 1: Integrate Real Backend Executor for GameTabs

**Title:** Integrate real backend Cubit executor/visualizer for GameTabs component

**Description:**
The `GameTabs.tsx` component currently uses a simple string comparison to check solutions. It should be updated to:

1. Call the backend `/execute` API endpoint to run the user's Cubit code
2. Validate the output against expected results
3. Provide visual feedback on code execution (show output, errors, etc.)
4. Optionally visualize the code execution step-by-step

**File:** `frontend/src/course/GameTabs.tsx`

**Current TODO Line:** Line 21

**Labels:** enhancement, backend-integration, course-features

---

## Issue 2: Integrate Real Backend Executor for ChallengeTabs

**Title:** Integrate real backend Cubit executor for ChallengeTabs component

**Description:**
The `ChallengeTabs.tsx` component currently uses a simple string comparison to check solutions. It should be updated to:

1. Call the backend `/execute` API endpoint to run the user's Cubit code
2. Validate the output against expected results
3. Provide detailed feedback on test cases (which passed, which failed)
4. Show execution output and errors to help users debug their solutions

**File:** `frontend/src/course/ChallengeTabs.tsx`

**Current TODO Line:** Line 21

**Labels:** enhancement, backend-integration, course-features

---

## Instructions

To create these issues:

1. Go to https://github.com/DoctorDoveDragon/Cubit/issues/new
2. Copy the title and description from each issue above
3. Add the suggested labels
4. Submit the issue
5. Update the TODO comments in the code files with the issue number (e.g., `// TODO #123: Replace with real API call...`)
