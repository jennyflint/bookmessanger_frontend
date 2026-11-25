<template>
  <div class="lang-switcher inline-flex items-center rounded-md border border-[#4b2c20]/20 bg-white/80 p-0.5 text-[13px] font-semibold select-none">
    <button
      v-for="item in items"
      :key="item.code"
      type="button"
      :aria-pressed="item.code === locale"
      :title="item.name"
      class="px-2.5 py-1 rounded transition-colors"
      :class="item.code === locale ? 'bg-[#4b2c20] text-white' : 'text-[#4b2c20]/70 hover:bg-[#4b2c20]/10'"
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
