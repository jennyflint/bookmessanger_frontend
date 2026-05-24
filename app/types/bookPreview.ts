export interface JsonToken {
  text: string
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'default'
}