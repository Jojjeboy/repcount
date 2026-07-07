<template>
  <div class="flex flex-col gap-4 py-4">
    <div class="flex justify-between items-center mb-2">
      <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Quick Add Examples</h4>
      <button
        @click="$emit('cancel')"
        class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        Cancel
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        v-for="example in examples"
        :key="example.uuid"
        @click="$emit('select', example)"
        class="text-left px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
      >
        {{ example.title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tally } from '@/composables/useTallies';

interface Props {
  examples: Tally[];
}

defineProps<Props>();

defineEmits<{
  'select': [example: Tally];
  'cancel': [];
}>();
</script>
