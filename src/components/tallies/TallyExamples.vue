<template>
  <div class="flex flex-col gap-4 py-4">
    <div class="flex justify-between items-center mb-2">
      <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400">{{ $t('tallies.quick_add_title') }}</h4>
      <button
        @click="$emit('cancel')"
        class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        {{ $t('tallies.cancel') }}
      </button>
    </div>
    <div v-if="examples.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        v-for="example in examples"
        :key="example.uuid"
        :disabled="example.isAdded"
        @click="$emit('select', example)"
        class="text-left px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md transition-colors"
        :class="example.isAdded
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100 dark:bg-white/[0.02] dark:text-gray-600 dark:border-gray-800'
          : 'hover:bg-gray-50 dark:hover:bg-white/[0.05] text-gray-700 dark:text-gray-300'"
      >
        {{ example.title }}
      </button>
    </div>
    <div v-else class="text-center py-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('tallies.all_added') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tally } from '@/composables/useTallies';

interface Props {
  examples: (Tally & { isAdded?: boolean })[];
}

defineProps<Props>();

defineEmits<{
  'select': [example: Tally];
  'cancel': [];
}>();
</script>
