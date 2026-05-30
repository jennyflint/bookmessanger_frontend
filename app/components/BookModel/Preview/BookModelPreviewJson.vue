<template>
  <div class="bg-slate-950 text-slate-100 ">
    <div v-if="!book?.lines || book.lines.length === 0" class="p-8 text-center text-sm text-slate-500 font-mono">
      // {{ $t('book_model.no_found') }}
    </div>
      
    <pre v-else class="p-6 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto custom-scrollbar select-text"><code><span 
      v-for="(token, index) in jsonTokens" 
      :key="index" 
      :class="getTokenClass(token.type)"
    >{{ token.text }}</span></code></pre>
  </div>
</template>

<script setup lang="ts">
import type { JsonToken } from "~/types/bookPreview"

const bookStore = useBookStore()
const { book } = storeToRefs(bookStore)
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
</script>