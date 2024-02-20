// @ts-nocheck

import { getDocument, updateDocument } from "../mongo"
import { createAccount, mongoId } from "../utils"

export async function POST(request: Request) {
  const res = await request.json()
  const sessionId = res['sessionId']

  const session = await getDocument('sessions', {'id': sessionId})

  if (session['trusted_device']) {
    await updateDocument('sessions', {'id': sessionId}, {'state': 'registered'})
  } else {
    await updateDocument('sessions', {'_id': mongoId(session['_id'])}, {'state': 'unknown'})
    const doc = await createAccount()
    await updateDocument('sessions', {'_id': mongoId(session['_id'])}, {'account': doc.insertedId})
  }

  return Response.json({'result': 'redirect'})
}