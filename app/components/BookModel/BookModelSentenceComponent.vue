<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-3 px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-800 rounded-t-2xl">
      <div class="flex items-center space-x-2">
        <div class="flex space-x-1.5">
          <span class="w-3 h-3 rounded-full bg-red-400 block"/>
          <span class="w-3 h-3 rounded-full bg-amber-400 block"/>
          <span class="w-3 h-3 rounded-full bg-emerald-400 block"/>
        </div>
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
          {{book?.name}}
        </span>
      </div>
      
      <button 
        v-if="book?.lines?.length"
        class="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
        @click="copyToClipboard"
      >
        <svg
          v-if="!isCopied"
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        <svg
          v-else
          class="w-3.5 h-3.5 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ isCopied ? $t('buttons.copied') : $t('buttons.copy')  }}</span>
      </button>
    </div>

    <div class="relative bg-slate-950 text-slate-100 rounded-b-2xl shadow-xl border border-slate-800 max-h-[550px] overflow-y-auto custom-scrollbar">
      <div v-if="!book?.lines || book.lines.length === 0" class="p-8 text-center text-sm text-slate-500 font-mono">
        // {{ $t('book_model.no_found') }}
      </div>
      
      <pre v-else class="p-6 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto custom-scrollbar select-text"><code><span 
        v-for="(token, index) in jsonTokens" 
        :key="index" 
        :class="getTokenClass(token.type)"
      >{{ token.text }}</span></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">


interface JsonToken {
  text: string
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'default'
}

const bookStore = useBookStore()
const { book } = storeToRefs(bookStore)

const isCopied = ref(false)

const jsonTokens = computed<JsonToken[]>(() => {
  if (!book.value?.lines) return []

  try {
    const jsonString = JSON.stringify(book.value.lines, null, 2)
    const tokens: JsonToken[] = []
    const tokenRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g
    
    let lastIndex = 0
    let match

   
    while ((match = tokenRegex.exec(jsonString)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          text: jsonString.substring(lastIndex, match.index),
          type: 'default'
        })
      }

      const tokenText = match[0]
      let type: JsonToken['type'] = 'number'

      if (/^"/.test(tokenText)) {
        if (/:$/.test(tokenText)) {
          type = 'key'
        } else {
          type = 'string'
        }
      } else if (/true|false/.test(tokenText)) {
        type = 'boolean'
      } else if (/null/.test(tokenText)) {
        type = 'null'
      }

      tokens.push({ text: tokenText, type })
      lastIndex = tokenRegex.lastIndex
    }
    if (lastIndex < jsonString.length) {
      tokens.push({
        text: jsonString.substring(lastIndex),
        type: 'default'
      })
    }

    return tokens
  } catch (e) {
    return [{ text: `Error: ${(e as Error).message}`, type: 'null' }]
  }
})


const getTokenClass = (type: JsonToken['type']): string => {
  switch (type) {
  case 'key': return 'text-indigo-400 font-semibold'
  case 'string': return 'text-emerald-400'
  case 'number': return 'text-amber-400'
  case 'boolean': return 'text-orange-400'
  case 'null': return 'text-rose-400 font-bold'
  default: return 'text-slate-100'
  }
}

const copyToClipboard = async (): Promise<void> => {
  if (!book.value?.lines) return
  try {
    const rawString = JSON.stringify(book.value.lines, null, 2)
    await navigator.clipboard.writeText(rawString)
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 2000)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #020617; 
  border-radius: 0 0 2rem 2rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155; 
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>