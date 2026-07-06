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
          <!-- Tally List -->
          <div v-if="tallies.length > 0" class="flex flex-col gap-3">
            <div
              v-for="tally in tallies"
              :key="tally.uuid"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]"
            >
              <div class="flex items-center gap-3">
                <div :style="{ backgroundColor: tally.color }" class="w-3 h-3 rounded-full"></div>
                <span class="font-medium text-gray-700 dark:text-gray-300">{{ tally.title }}</span>
              </div>
              <div class="text-lg font-bold text-gray-800 dark:text-white">
                {{ tally.value }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
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

          <!-- Example Selection -->
          <div v-else-if="showExamples" class="flex flex-col gap-4 py-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Quick Add Examples</h4>
              <button @click="showExamples = false" class="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                v-for="example in exampleData.data"
                :key="example.uuid"
                @click="addExample(example as Tally)"
                class="text-left px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
              >
                {{ example.title }}
              </button>
            </div>
          </div>

          <!-- Create New Form -->
          <div v-else-if="showForm" class="flex flex-col gap-4 py-4 text-left">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Create New Tally</h4>
              <button @click="showForm = false" class="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
            <form @submit.prevent="submitNewTally" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input v-model="form.title" type="text" required class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Increase By</label>
                <input v-model.number="form.increseBy" type="number" required class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Decrease By</label>
                <input v-model.number="form.decreseBy" type="number" required class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Goal</label>
                <input v-model.number="form.goal" type="number" required class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Color</label>
                <input v-model="form.color" type="color" required class="w-full h-9 px-1 py-1 border rounded-lg dark:bg-white/[0.03] dark:border-gray-700" />
              </div>
              <div class="flex items-center gap-2">
                <input v-model="form.reset" type="checkbox" id="reset" class="rounded border-gray-300 text-blue-600" />
                <label for="reset" class="text-xs font-medium text-gray-500">Auto Reset</label>
              </div>
              <div v-if="form.reset">
                <label class="block text-xs font-medium text-gray-500 mb-1">Interval</label>
                <select v-model="form.resetInterval" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div class="sm:col-span-2 mt-2">
                <button type="submit" class="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Tally
                </button>
              </div>
            </form>
          </div>
        </ComponentCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { useTallies, type Tally, type TallyHistory } from "@/composables/useTallies";
import exampleData from "@/example/example.data.json";

const { tallies, getTallies, addTally } = useTallies();

const showExamples = ref(false);
const showForm = ref(false);

const form = ref({
  title: '',
  increseBy: 1,
  decreseBy: 1,
  reset: false,
  resetInterval: 'daily' as 'daily' | 'weekly' | 'monthly' | null,
  value: 0,
  goal: 0,
  topScore: 0,
  active: true,
  color: '#3B82F6',
  history: [] as TallyHistory[]
});

onMounted(() => {
  getTallies();
});

async function addExample(example: Tally) {
  try {
    const tallyData = Object.fromEntries(
      Object.entries(example).filter(([key]) => key !== 'uuid')
    ) as Omit<Tally, 'uuid'>;
    await addTally(tallyData);
    showExamples.value = false;
  } catch (error) {
    console.error("Failed to add example tally:", error);
  }
}

async function submitNewTally() {
  try {
    await addTally({
      ...form.value,
      lastTouched: new Date().toISOString(),
    });
    showForm.value = false;
    // Reset form
    form.value = {
      title: '',
      increseBy: 1,
      decreseBy: 1,
      reset: false,
      resetInterval: 'daily',
      value: 0,
      goal: 0,
      topScore: 0,
      active: true,
      color: '#3B82F6',
      history: []
    };
  } catch (error) {
    console.error("Failed to create tally:", error);
  }
}
</script>

<style></style>
