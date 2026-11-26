import type { ParserMode } from '~/types/book'

/** All modes the UI knows, cheapest first: the mode cards follow this order. */
export const PARSER_MODE_ORDER: readonly ParserMode[] = ['spacy', 'spacy_llm', 'llm']

/** True for paid modes that call an LLM and need a provider. */
export const usesLlm = (mode: ParserMode | null | undefined): boolean =>
  mode === 'llm' || mode === 'spacy_llm'

export const isKnownParserMode = (mode: unknown): mode is ParserMode =>
  PARSER_MODE_ORDER.includes(mode as ParserMode)

export const sortParserModes = (modes: readonly ParserMode[]): ParserMode[] =>
  [...modes].sort((a, b) => PARSER_MODE_ORDER.indexOf(a) - PARSER_MODE_ORDER.indexOf(b))
