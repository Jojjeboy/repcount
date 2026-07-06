# Plan: Expandable Tally Cards Implementation

## Objective
Enhance the tally list in `src/views/Start.vue` to allow users to expand a tally item and access detailed information, counter controls, and management actions.

## 1. UI Architecture
- **State Management**: Introduce a `selectedTallyId` ref to track which tally is currently expanded.
- **Expansion Logic**: 
    - Wrap the tally summary in a clickable container that toggles `selectedTallyId`.
    - Use a `v-if="selectedTallyId === tally.uuid"` block to render the expanded detail view.
- **Visual Cues**: Add a chevron icon (▲/▼) to indicate the expansion state.

## 2. Counter Controls
- **Functionality**: Implement `changeValue(tally, amount)` function.
- **Logic**:
    - Use `tally.increseBy` for the `+` button.
    - Use `tally.decreseBy` for the `-` button.
    - Update the `value` in Firestore.
    - Update the `lastTouched` timestamp to the current ISO string.
    - Ensure the value does not drop below 0 (unless negative tallies are allowed).

## 3. Detailed Data & History
- **Stats Grid**: Display a 3-column grid showing:
    - **Goal**: The target value.
    - **Top Score**: The highest value achieved.
    - **Status**: Active/Inactive label with color coding (Green/Red).
- **History Log**: 
    - Iterate over the `tally.history` array.
    - Display a list of dates and values in a scrollable container.

## 4. Management Actions
- **Edit**: 
    - Populate the existing `form` ref with the selected tally's data.
    - Set `showForm = true` to reveal the edit form.
- **Inactivate/Activate**: 
    - Toggle the `active` boolean property.
    - Update the document in Firestore.
- **Remove**: 
    - Call the `deleteTally` method from `useTallies` composable using the `uuid`.

## 5. Styling & UX
- **Tailwind CSS**: 
    - Use `transition-all` for smooth expansion.
    - Use a clean, bordered layout for the expanded section to separate it from the summary.
    - Ensure dark mode compatibility using `dark:` utility classes.

## 6. Quality Assurance
- **Type Safety**: Ensure all new functions are correctly typed using the `Tally` interface.
- **Validation**: Run `npm run validate` to ensure no ESLint errors or TypeScript mismatches were introduced.