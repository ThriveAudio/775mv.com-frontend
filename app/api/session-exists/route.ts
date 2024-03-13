// @ts-nocheck
import { getDocument } from "../mongo"

export async function POST(request: Request) {
  // console.log('POST session-exists Nextjs API called')
  const res = await request.json()
  const session = await getDocument('sessions', {'id': res['value']})
  return Response.json(session != null)
}