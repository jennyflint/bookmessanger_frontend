<template>
  <div class="lang-switcher inline-flex items-center rounded-md border border-comic-ink/20 bg-comic-surface/80 p-0.5 text-[13px] font-semibold select-none">
    <button
      v-for="item in items"
      :key="item.code"
      type="button"
      :aria-pressed="item.code === locale"
      :title="item.name"
      class="px-2.5 py-1 rounded transition-colors"
      :class="item.code === locale ? 'bg-comic-ink text-comic-surface' : 'text-comic-ink/70 hover:bg-comic-ink/10'"
      @click="setLocale(item.code)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
const { locale, setLocale } = useI18n()

const items = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ua', label: 'UA', name: 'Ukrainian' },
] as const
</script>
