# Project Requirements: PushIt (Advanced Tally Counter PWA)

This document serves as a comprehensive specification for rebuilding the "PushIt" application. The goal is to create a high-performance, cloud-synced Progressive Web App (PWA) that allows users to track multiple customizable counters with historical logging.

## 🛠 Technical Stack
- **Framework**: Vue.js 3 (Composition API) - *Provided via Boilerplate*
- **State Management**: Pinia - *Provided via Boilerplate*
- **Styling**: Tailwind CSS
- **Database/Backend**: Firebase (Firestore & Authentication) - *Provided via Boilerplate*
- **Authentication**: Google Login via Firebase Auth - *Provided via Boilerplate*
- **Deployment**: PWA (Vite PWA Plugin)



## 🚀 Step-by-Step Implementation Guide

**CRITICAL INSTRUCTION**: This project is based on a boilerplate that already has Vue.js, Firebase, and Google Authentication configured. The entire application is protected by this authentication layer. You are encouraged to implement the best possible architecture for this stack rather than a 1:1 translation of the previous version. After completing the requirements of **each step**, you MUST run the command `npm run validate` to ensure the application remains stable.

### Step 1: Environment Enhancement & PWA Setup ✅
**Goal**: Prepare the boilerplate for a modern, responsive, and installable experience, establishing the visual identity early.

**AI Prompt**:
"Using the existing Vue/Firebase boilerplate (which includes Google Auth), enhance the environment to support a professional PWA. 

**UI Design Preferences**:
- **Typography**: Use the 'Inter' font (https://fonts.google.com/specimen/Inter).
- **Visual Style**: Follow the aesthetic and layout inspiration from this design: https://dribbble.com/Vitwai/projects/734335-Kenko-Workout-Trackeriment  (focusing on the clean, dark-themed, high-contrast athletic look).

1. Integrate **Tailwind CSS** to enable a utility-first, responsive design system that implements the visual style described above.
2. Set up **Pinia** to handle the application's global reactive state.
3. Configure the **Vite PWA Plugin** to ensure the app is installable, has a proper manifest, and works offline via service workers.
4. Establish a scalable directory structure (e.g., separating business logic/services from UI components and state stores).
5. Implement a core layout shell that integrates with the existing authentication state, providing a consistent navigation experience and user profile access across mobile and desktop.
6. **Validation**: Once complete, run `npm run validate` and confirm the output is successful."

---

### Step 2: Core Domain Modeling & State Architecture ✅
**Goal**: Design a robust data layer that supports the app's purpose: tracking metrics over time.

**AI Prompt**:
"Design the data architecture and state management for the tally system. Focus on the underlying purpose: tracking a value toward a goal with historical snapshots. Use `src/example/example.data.json` as the primary reference for the data model.

1. **Domain Model**: Define the necessary attributes for a 'Tally' based on the example data:
    - Identity: `uuid`, `title`
    - Value Tracking: `value`, `increseBy`, `decreseBy`, `topScore`
    - Goals & Status: `goal`, `active`, `color`
    - Reset Logic: `reset` (boolean), `resetInterval` (e.g., 'daily', 'weekly', 'monthly')
    - Metadata: `lastTouched`
2. **Historical Tracking**: Design a mechanism to store 'snapshots' of a tally's progress (containing `value`, `goal`, and `date`) as seen in the `history` array of the example data.
3. **State Management**: Implement a Pinia-based system to manage these entities. The architecture should prioritize reactivity and be decoupled from the persistence layer to allow for easy synchronization with Firestore.
4. **Business Logic**: Implement the core logic for modifying values, ensuring that increments and decrements respect the custom step sizes defined for each tally.
5. **Validation**: Once complete, run `npm run validate` and confirm the output is successful."

---

### Step 3: User Interface for Tally Interaction ✅
**Goal**: Create an intuitive, high-frictionless interface for the primary user task: counting.

**AI Prompt**:
"Build the primary user interface using Vue 3 and Tailwind CSS, focusing on a 'mobile-first' experience. 

1. **The Dashboard**: Implement a view that allows users to see their active counters at a glance. Use visual cues (like progress bars or color coding) to indicate how close a tally is to its goal.
2. **Interaction Design**: Create highly accessible 'Quick Action' controls for increasing and decreasing values. The interaction should feel instantaneous and tactile.
3. **Tally Lifecycle**: Implement the flow for creating and configuring new counters, allowing users to define their goals and custom step values.
4. **Organization**: Provide a way to filter or archive counters to keep the main dashboard focused on current priorities.
5. **Validation**: Once complete, run `npm run validate` and confirm the output is successful."

---

### Step 4: Progress Analytics & Periodic Archiving
**Goal**: Implement the 'intelligence' of the app: tracking trends and automating resets.

**AI Prompt**:
"Implement the advanced logic for progress analysis and the automated archiving system.
1. **Analytics Engine**: Create a service to calculate meaningful metrics from the data, such as:
    - Current percentage of goal completion.
    - Lifetime aggregate progress (combining current and historical data).
    - Performance averages over time.
2. **Periodic Archiving (Auto-Reset)**: Implement a system that automatically archives the current state of a counter into the history log based on a user-defined interval (e.g., daily or weekly). The system should detect when an interval has passed since the last interaction and reset the counter to zero.
3. **Insight View**: Build a detail view for each tally that visualizes its history and current standing, providing the user with a sense of progress over time.
4. **Validation**: Once complete, run `npm run validate` and confirm the output is successful."

---

### Step 5: Cloud Synchronization & Persistence
**Goal**: Ensure data is safe, synced, and user-specific.

**AI Prompt**:
"Connect the application state to the Firebase Firestore backend to enable cloud synchronization.
1. **User-Scoped Persistence**: Implement a synchronization strategy that mirrors the Pinia state to Firestore. **Crucially, all data must be scoped to the currently authenticated user's UID** to ensure users only access their own tallies.
2. **Initial Data Seeding**: If a new user has no tallies created, provide an option or automatic mechanism to seed their account with the boilerplate data from `src/example/example.data.json`.
3. **Real-time Sync**: Leverage Firestore's real-time capabilities so that changes are reflected instantly across multiple devices for the authenticated user.
4. **Offline-First Experience**: Configure Firestore's offline persistence to ensure the app remains fully functional in areas with poor connectivity, syncing changes automatically when back online.
5. **Data Integrity**: Ensure that the synchronization logic handles potential conflicts and maintains the integrity of the historical logs.
5. **Validation**: Once complete, run `npm run validate` and confirm the output is successful."

---

### Step 6: Production Polish & Ecosystem Integration
**Goal**: Transform the functional app into a polished product with developer transparency.

**AI Prompt**:
"Finalize the PWA and implement the ecosystem features.
1. **PWA Optimization**: Fine-tune the manifest and service worker for optimal installation and caching behavior.
2. **Transparency Features**: 
    - Implement a 'Changelog' view that displays the project's evolution based on a version configuration.
    - Integrate the GitHub API to show the current state of project issues, allowing users to see what's being worked on.
3. **UX Refinement**: Add polished transitions, loading skeletons for async data, and ensure the app meets modern accessibility (a11y) standards.
4. **Validation**: Once complete, run `npm run validate` and confirm the output is successful."


POE-podd 