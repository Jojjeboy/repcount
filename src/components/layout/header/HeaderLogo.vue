<template>
  <router-link to="/" class="lg:hidden">
    <span class="text-xl font-bold text-gray-800 dark:text-white">
      {{ $t('brand.name') }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
