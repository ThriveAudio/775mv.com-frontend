// @ts-nocheck

import { getDocument } from "../mongo"

export async function POST(request: Request) {
  console.log('POST trusted-check Nextjs API called')
  const res = await request.json()
  const sessionId = res['sessionId']
  const session = await getDocument('sessions', {'id': sessionId})
  return Response.json(session['trusted_device'])
}