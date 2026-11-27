<template>
  <ClientOnly>
    <div
      role="group"
      :aria-label="$t('theme.label')"
      class="theme-switcher inline-flex items-center rounded-md border border-comic-ink/20 bg-comic-surface/80 p-0.5 select-none"
    >
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        :aria-pressed="item.value === preference"
        :title="$t(`theme.${item.value}`)"
        :aria-label="$t(`theme.${item.value}`)"
        class="p-1.5 rounded transition-colors"
        :class="item.value === preference ? 'bg-comic-ink text-comic-surface' : 'text-comic-ink/70 hover:bg-comic-ink/10'"
        @click="setTheme(item.value)"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="item.icon" />
        </svg>
      </button>
    </div>

    <template #fallback>
      <!-- Same footprint as the switcher, so the layout doesn't jump on hydration -->
      <div class="inline-block h-[32px] w-[94px] rounded-md border border-comic-ink/20" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { ThemePreference } from '~/composables/useTheme'

const { preference, setTheme } = useTheme()

const items: ReadonlyArray<{ value: ThemePreference; icon: string }> = [
  {
    value: 'light',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    value: 'system',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    value: 'dark',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
]
</script>
