export type AiProvider = 'anthropic' | 'openai' | 'azure' | 'none'

export interface AiConfig {
  enabled: boolean
  provider: AiProvider
  model: string
}

export function isAiEnabled(): boolean {
  return String(process.env.AI_ENABLED).toLowerCase() === 'true'
}

export function getAiConfig(): AiConfig {
  const enabled = isAiEnabled()
  const provider = (process.env.AI_PROVIDER || 'anthropic') as AiProvider
  const model = process.env.NEXT_PUBLIC_AI_MODEL || process.env.AI_MODEL || 'claude-sonnet-4.5'
  return { enabled, provider, model }
}
