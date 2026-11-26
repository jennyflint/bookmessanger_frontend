<template>
  <div class="space-y-3 text-left">
    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
      {{ $t("parser.title") }}
    </p>

    <div
      role="radiogroup"
      :aria-label="$t('parser.title')"
      :class="['grid gap-3', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3']"
    >
      <button
        v-for="option in displayedModes"
        :key="option"
        type="button"
        role="radio"
        :aria-checked="mode === option"
        :disabled="disabled"
        :style="{ order: PARSER_MODE_ORDER.indexOf(option) }"
        :class="[
          'rounded-xl border-2 px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed',
          mode === option
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
            : 'border-slate-200 hover:border-indigo-300 bg-white dark:bg-slate-800 dark:border-slate-600',
        ]"
        @click="selectMode(option)"
      >
        <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">
          {{ $t(`parser.modes.${option}`) }}
        </span>
        <span class="block mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {{ $t(`parser.descriptions.${option}`) }}
        </span>
      </button>

      <skeleton-parser-mode-component
        v-for="item in loadingModes"
        :key="`loading-${item}`"
        :style="{ order: PARSER_MODE_ORDER.indexOf(item) }"
      />
    </div>

    <div
      v-if="features.length"
      class="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300"
    >
      <ul class="list-disc pl-4 space-y-1">
        <li v-for="feature in features" :key="feature">
          {{ feature }}
        </li>
      </ul>
    </div>

    <div v-if="usesLlm(mode) && parserOptionsStore.llmProviders.length > 1">
      <label :for="providerSelectId" class="block mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {{ $t("parser.provider") }}
      </label>
      <select
        :id="providerSelectId"
        v-model="provider"
        :disabled="disabled"
        class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
      >
        <option
          v-for="item in parserOptionsStore.llmProviders"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </option>
      </select>
    </div>

    <p
      v-if="isModeLoading"
      class="sr-only"
      role="status">
      {{ $t("parser.loading") }}
    </p>
    <p v-else-if="parserOptionsStore.error" class="text-xs text-slate-500 dark:text-slate-400">
      {{ $t("parser.options_unavailable") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, useId, watch } from "vue";
import type { ParserMode } from "~/types/book";
import { useParserOptionsStore } from "~/stores/parserOptions";
import { PARSER_MODE_ORDER, sortParserModes, usesLlm } from "~/utils/parserMode";

withDefaults(
  defineProps<{
    disabled?: boolean;
    /** Stack the mode cards vertically (for narrow containers such as modals) */
    compact?: boolean;
  }>(),
  {
    disabled: false,
    compact: false,
  }
);

const mode = defineModel<ParserMode>("mode", { default: "spacy" });
const provider = defineModel<string | null>("provider", { default: null });

const parserOptionsStore = useParserOptionsStore();
const { t } = useI18n();

// Order of the feature list shown under the mode cards (keys in parser.features.<mode>)
const FEATURE_KEYS: Record<ParserMode, string[]> = {
  spacy: ["speed", "simple_dialogs", "complex_dialogs"],
  spacy_llm: ["accuracy", "cost", "duration"],
  llm: ["accuracy", "unnamed_speakers", "duration"],
};

const features = computed<string[]>(() =>
  (FEATURE_KEYS[mode.value] ?? []).map((key) => t(`parser.features.${mode.value}.${key}`))
);
const providerSelectId = useId();

// While the options are loading, keep the current selection visible
// so a saved paid mode does not disappear for a moment.
const displayedModes = computed<ParserMode[]>(() => {
  const modes = parserOptionsStore.availableModes;
  if (!parserOptionsStore.isResolved && !modes.includes(mode.value)) {
    return sortParserModes([...modes, mode.value]);
  }
  return modes;
});

// Paid modes appear only after the options arrive: hold a place for each until then
const loadingModes = computed<ParserMode[]>(() => {
  if (parserOptionsStore.isResolved) return [];
  return PARSER_MODE_ORDER.filter((item) => usesLlm(item) && !displayedModes.value.includes(item));
});
const isModeLoading = computed<boolean>(() => loadingModes.value.length > 0);

const selectMode = (value: ParserMode): void => {
  mode.value = value;
};

// Keep the selection valid against what the backend actually offers.
const normalizeSelection = (): void => {
  if (!parserOptionsStore.isResolved) return;

  if (!parserOptionsStore.availableModes.includes(mode.value)) {
    mode.value = "spacy";
  }

  if (usesLlm(mode.value)) {
    const isKnownProvider = parserOptionsStore.llmProviders.some((item) => item.value === provider.value);
    if (!isKnownProvider) {
      provider.value = parserOptionsStore.defaultProvider;
    }
  }
};

watch(
  () => [mode.value, provider.value, parserOptionsStore.isResolved, parserOptionsStore.llmProviders],
  normalizeSelection,
  { immediate: true }
);

onMounted(() => {
  parserOptionsStore.fetchOptions();
});
</script>
