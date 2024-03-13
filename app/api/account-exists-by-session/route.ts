// @ts-nocheck
import { getDocument } from "../mongo"
import { mongoId } from "../utils"

export async function POST(request: Request) {
  // console.log('POST session-exists Nextjs API called')
  const res = await request.json()
  const session = await getDocument('sessions', {'id': res['value']})
  const account = await getDocument('accounts', {'_id': mongoId(session['account'])})
  return Response.json(account != null)
}