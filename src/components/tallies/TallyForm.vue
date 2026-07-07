<template>
  <div class="flex flex-col gap-4 py-4 text-left">
    <div class="flex justify-between items-center mb-2">
      <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {{ isEditing ? 'Edit Tally' : 'Create New Tally' }}
      </h4>
      <button
        @click="$emit('cancel')"
        class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Tally Title -->
      <div class="sm:col-span-2">
        <label class="block text-xs font-medium text-gray-500 mb-1">Title</label>
        <input
          v-model="localForm.title"
          type="text"
          required
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white"
          placeholder="e.g. Daily Pushups"
        />
      </div>

      <!-- Increment Value -->
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Increase By</label>
        <input
          v-model.number="localForm.increseBy"
          type="number"
          required
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white"
        />
      </div>

      <!-- Decrement Value -->
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Decrease By</label>
        <input
          v-model.number="localForm.decreseBy"
          type="number"
          required
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white"
        />
      </div>

      <!-- Goal Value -->
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Goal</label>
        <input
          v-model.number="localForm.goal"
          type="number"
          required
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white"
        />
      </div>

      <!-- Color Picker -->
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Color</label>
        <input
          v-model="localForm.color"
          type="color"
          required
          class="w-full h-9 px-1 py-1 border rounded-lg dark:bg-white/[0.03] dark:border-gray-700"
        />
      </div>

      <!-- Auto Reset Toggle -->
      <div class="flex items-center gap-2">
        <input
          v-model="localForm.reset"
          type="checkbox"
          id="reset"
          class="rounded border-gray-300 text-blue-600"
        />
        <label for="reset" class="text-xs font-medium text-gray-500">Auto Reset</label>
      </div>

      <!-- Reset Interval (Conditional) -->
      <div v-if="localForm.reset">
        <label class="block text-xs font-medium text-gray-500 mb-1">Interval</label>
        <select
          v-model="localForm.resetInterval"
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-white/[0.03] dark:border-gray-700 dark:text-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="sm:col-span-2 mt-2">
        <button
          type="submit"
          class="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ isEditing ? 'Update Tally' : 'Save Tally' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { Tally } from '@/composables/useTallies';

interface Props {
  initialData: Tally | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'submit': [data: Partial<Tally>];
  'cancel': [];
}>();

const isEditing = computed(() => !!props.initialData);

// Local state for the form to avoid mutating props directly
const localForm = reactive({
  title: props.initialData?.title || '',
  increseBy: props.initialData?.increseBy || 1,
  decreseBy: props.initialData?.decreseBy || 1,
  reset: props.initialData?.reset || false,
  resetInterval: (props.initialData?.resetInterval as "daily" | "weekly" | "monthly" | null) || 'daily',
  value: props.initialData?.value || 0,
  goal: props.initialData?.goal || 0,
  topScore: props.initialData?.topScore || 0,
  active: props.initialData?.active ?? true,
  color: props.initialData?.color || '#3B82F6',
  history: props.initialData?.history || []
});

function handleSubmit() {
  emit('submit', { ...localForm });
}
</script>

<script lang="ts">
import { computed } from 'vue';
// Note: computed is used in the template via isEditing
</script>
