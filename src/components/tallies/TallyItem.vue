<template>
  <div class="flex flex-col gap-2">
    <!-- Tally Summary: Clickable area to toggle expansion -->
    <div
      @click="$emit('toggle-expand')"
      class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02] cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
    >
      <div class="flex items-center gap-3">
        <div :style="{ backgroundColor: tally.color }" class="w-3 h-3 rounded-full"></div>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ tally.title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-lg font-bold text-gray-800 dark:text-white">
          {{ tally.value }}
        </div>
        <ChevronDownIcon
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>
    </div>

    <!-- Expanded Detail View: Shown only when this item is selected -->
    <div
      v-if="isExpanded"
      :style="{ borderLeftColor: tally.color }"
      class="p-4 rounded-lg border-l-4 border-y border-r border-gray-200 dark:border-y dark:border-r dark:border-gray-700 bg-white dark:bg-white/[0.01] text-left animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <!-- Counter Controls: Quick increment/decrement -->
      <div class="flex items-center justify-center gap-4 mb-6">
        <button
          @click="$emit('change-value', -tally.decreseBy)"
          class="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] text-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
        >
          -
        </button>
        <div class="text-3xl font-bold text-gray-800 dark:text-white min-w-[60px] text-center">
          {{ tally.value }}
        </div>
        <button
          @click="$emit('change-value', tally.increseBy)"
          class="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] text-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
        >
          +
        </button>
      </div>

      <!-- Stats Grid: High-level tally metrics -->
      <div class="grid grid-cols-3 gap-4 mb-6 p-3 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800">
        <div class="text-center">
          <p class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{{ $t('tallies.goal') }}</p>
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ tally.goal }}</p>
        </div>
        <div class="text-center border-x border-gray-200 dark:border-gray-800">
          <p class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{{ $t('tallies.top_score') }}</p>
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ tally.topScore }}</p>
        </div>
        <div class="text-center">
          <p class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{{ $t('tallies.status') }}</p>
          <div class="flex items-center justify-center gap-1.5">
            <div :class="tally.active ? 'bg-green-500' : 'bg-red-500'" class="w-1.5 h-1.5 rounded-full"></div>
            <p class="text-xs font-semibold" :class="tally.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ tally.active ? $t('tallies.active') : $t('tallies.inactive') }}
            </p>
          </div>
        </div>
      </div>

      <!-- History Log: Collapsible list of previous values -->
      <div class="mb-6">
        <button
          @click="showHistory = !showHistory"
          class="flex items-center justify-between w-full mb-2 group"
        >
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {{ $t('tallies.history') }}
          </h4>
          <ChevronDownIcon
            class="w-3 h-3 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-200"
            :class="{ 'rotate-180': showHistory }"
          />
        </button>

        <div v-if="showHistory" class="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-200">
          <div
            v-for="(entry, index) in tally.history.slice().reverse()"
            :key="index"
            class="flex items-center gap-3 p-2 text-xs rounded bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800"
          >
            <span class="text-gray-500 dark:text-gray-400 whitespace-nowrap w-24 truncate">{{ entry.date }}</span>
            <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                :style="{ width: `${(entry.value / (tally.topScore || 1)) * 100}%`, backgroundColor: tally.color }"
                class="h-full rounded-full transition-all duration-500"
              ></div>
            </div>
            <span class="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap min-w-[20px] text-right">{{ entry.value }}</span>
          </div>
           <p v-if="tally.history.length === 0" class="text-xs text-gray-400 text-center py-2">
             {{ $t('tallies.no_history') }}
           </p>
        </div>
      </div>

      <!-- Management Actions: Edit, Toggle Status, and Delete -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          @click="$emit('edit', tally)"
          class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-400 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] transition-colors"
        >
          {{ $t('tallies.edit') }}
        </button>
        <div class="flex gap-2">
           <button
             @click="$emit('toggle-active', tally)"
             class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-400 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] transition-colors"
           >
             {{ tally.active ? $t('tallies.deactivate') : $t('tallies.activate') }}
           </button>
           <button
             @click="$emit('remove', tally.uuid)"
             class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
           >
             {{ $t('tallies.remove') }}
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChevronDownIcon from "@/icons/ChevronDownIcon.vue";
import type { Tally } from "@/composables/useTallies";

interface Props {
  tally: Tally;
  isExpanded: boolean;
}

defineProps<Props>();

const showHistory = ref(false);

defineEmits<{
  'toggle-expand': [];
  'change-value': [amount: number];
  'edit': [tally: Tally];
  'toggle-active': [tally: Tally];
  'remove': [uuid: string];
}>();
</script>
