<template>
  <AdminLayout>
    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mx-auto w-full max-w-[630px] text-center">
        <h3
          class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl"
        >
          Start
        </h3>

        <ComponentCard title="My Tallies">
          <!-- Tally List: Rendered when tallies exist -->
          <div v-if="tallies.length > 0" class="flex flex-col gap-3">
            <TallyItem
              v-for="tally in tallies"
              :key="tally.uuid"
              :tally="tally"
              :is-expanded="selectedTallyId === tally.uuid"
              @toggle-expand="selectedTallyId = selectedTallyId === tally.uuid ? null : tally.uuid"
              @change-value="(amount) => changeValue(tally, amount)"
              @edit="editTally"
              @toggle-active="toggleActive"
              @remove="removeTally"
            />
          </div>

          <!-- Empty State: Shown when no tallies are present and no form/examples are open -->
          <div v-else-if="!showExamples && !showForm" class="flex flex-col items-center gap-4 py-6">
            <p class="text-gray-500 dark:text-gray-400">No tallies saved yet. Get started by adding one!</p>
            <div class="flex gap-3">
              <button
                @click="showExamples = true"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add example
              </button>
              <button
                @click="showForm = true"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                Create new
              </button>
            </div>
          </div>

          <!-- Example Selection: Grid of pre-defined tallies -->
          <TallyExamples
            v-else-if="showExamples"
            :examples="(exampleData.data as Tally[])"
            @select="addExample"
            @cancel="showExamples = false"
          />

          <!-- Create/Edit Form: Input fields for tally configuration -->
          <TallyForm
            v-else-if="showForm"
            :initial-data="editingTally"
            @submit="submitTally"
            @cancel="cancelForm"
          />
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { useTallies, type Tally } from "@/composables/useTallies";
import exampleData from "@/example/example.data.json";

// Component Imports
import TallyItem from "@/components/tallies/TallyItem.vue";
import TallyForm from "@/components/tallies/TallyForm.vue";
import TallyExamples from "@/components/tallies/TallyExamples.vue";

const { tallies, getTallies, addTally, updateTally, deleteTally } = useTallies();

/**
 * STATE MANAGEMENT
 */
const selectedTallyId = ref<string | null>(null);
const showExamples = ref(false);
const showForm = ref(false);
const editingTally = ref<Tally | null>(null);

/**
 * LIFECYCLE
 */
onMounted(() => {
  getTallies();
});

/**
 * ACTIONS
 */

/**
 * Adds a pre-defined example tally to the user's collection.
 * @param example The example tally object from the JSON data.
 */
async function addExample(example: Tally) {
  try {
    // Remove the UUID from the example to let Firestore generate a new unique ID
    const tallyData = Object.fromEntries(
      Object.entries(example).filter(([key]) => key !== 'uuid')
    ) as Omit<Tally, 'uuid'>;

    await addTally(tallyData);
    showExamples.value = false;
  } catch (error) {
    console.error("Failed to add example tally:", error);
  }
}

/**
 * Handles both creating a new tally and updating an existing one.
 * @param data The form data containing tally configuration.
 */
async function submitTally(data: Partial<Tally>) {
  try {
    if (editingTally.value) {
      // Update existing tally
      await updateTally(editingTally.value.uuid, data);
    } else {
      // Create new tally with current timestamp
      await addTally({
        ...data,
        lastTouched: new Date().toISOString(),
      } as Omit<Tally, 'uuid'>);
    }
    cancelForm();
  } catch (error) {
    console.error("Failed to save tally:", error);
  }
}

/**
 * Updates the current value of a tally, ensuring it doesn't drop below zero.
 * Also updates the topScore if the new value is the highest achieved.
 * @param tally The tally object to update.
 * @param amount The amount to change (positive for increase, negative for decrease).
 */
async function changeValue(tally: Tally, amount: number) {
  try {
    const newValue = Math.max(0, tally.value + amount);
    const newTopScore = Math.max(tally.topScore, newValue);

    await updateTally(tally.uuid, {
      value: newValue,
      topScore: newTopScore,
      lastTouched: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to update tally value:", error);
  }
}

/**
 * Prepares the form for editing a specific tally.
 * @param tally The tally to be edited.
 */
function editTally(tally: Tally) {
  editingTally.value = tally;
  showForm.value = true;
  selectedTallyId.value = null;
}

/**
 * Toggles the active/inactive status of a tally.
 * @param tally The tally to toggle.
 */
async function toggleActive(tally: Tally) {
  try {
    await updateTally(tally.uuid, {
      active: !tally.active
    });
  } catch (error) {
    console.error("Failed to toggle tally status:", error);
  }
}

/**
 * Removes a tally from the collection after user confirmation.
 * @param uuid The unique identifier of the tally to remove.
 */
async function removeTally(uuid: string) {
  if (!confirm('Are you sure you want to remove this tally?')) return;
  try {
    await deleteTally(uuid);
    selectedTallyId.value = null;
  } catch (error) {
    console.error("Failed to remove tally:", error);
  }
}

/**
 * Resets the form state and closes the form view.
 */
function cancelForm() {
  showForm.value = false;
  editingTally.value = null;
}
</script>

<style></style>
