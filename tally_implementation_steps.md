# Implementation Roadmap: Expandable Tally Cards

This document breaks down the `tally_expansion_plan.md` into three verifiable implementation phases.

## Phase 1: Foundation & Expansion UI
**Goal**: Establish the mechanism to expand/collapse tally cards and set up the basic layout.

- **Tasks**:
    - [ ] **State Management**: Implement `selectedTallyId` ref in `src/views/Start.vue`.
    - [ ] **Expansion Logic**: Wrap tally summaries in clickable containers to toggle `selectedTallyId`.
    - [ ] **UI Structure**: Add the `v-if="selectedTallyId === tally.uuid"` block for the expanded view.
    - [ ] **Visual Cues**: Integrate chevron icons to indicate expansion state.
    - [ ] **Basic Styling**: Apply initial Tailwind classes for the expanded section container.
- **Verification**: 
    - Manual check: Tally cards expand and collapse correctly.
    - Command: `npm run validation`

## Phase 2: Interaction & Information
**Goal**: Implement the core tallying functionality and display detailed statistics.

- **Tasks**:
    - [ ] **Counter Logic**: Implement `changeValue(tally, amount)` function in `src/views/Start.vue`.
    - [ ] **Firestore Integration**: Ensure value updates and `lastTouched` timestamps are persisted.
    - [ ] **Stats Grid**: Create a 3-column grid for Goal, Top Score, and Status.
    - [ ] **History Log**: Implement the scrollable history list iterating over `tally.history`.
- **Verification**: 
    - Manual check: Counters update correctly and history/stats are visible.
    - Command: `npm run validation`

## Phase 3: Management & Refinement
**Goal**: Add administrative controls and polish the user experience.

- **Tasks**:
    - [ ] **Edit Action**: Link the expanded view to the existing edit form.
    - [ ] **Status Toggle**: Implement Activate/Inactivate functionality.
    - [ ] **Removal**: Implement the delete action using `useTallies` composable.
    - [ ] **UX Polish**: Add `transition-all` for smooth expansion and ensure full dark mode compatibility.
    - [ ] **Final QA**: Verify type safety across all new implementations.
- **Verification**: 
    - Manual check: Edit, Toggle, and Delete actions work as expected.
    - Command: `npm run validation`