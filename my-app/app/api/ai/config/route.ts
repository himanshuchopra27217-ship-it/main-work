import { NextResponse } from 'next/server'
import { getAiConfig } from '../../../../lib/ai'

export async function GET() {
  const config = getAiConfig()
  return NextResponse.json(config)
}
