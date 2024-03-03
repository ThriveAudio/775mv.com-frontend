// @ts-nocheck

import { getCollectionAsArray, updateDocument } from "../mongo"
import { createAccount, mongoId } from "../utils"

export async function GET() {
  console.log("GET logout-expired-sessions Nextjs API called")
  const sessions = await getCollectionAsArray('sessions')

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]

    if (Date.now()/1000 > session['expiration'] && session['state'] != "unknown") {
      if (!session['trusted_device']) {
        await updateDocument('sessions', {'_id': mongoId(session['_id'])}, {'state': 'unknown'})
        const doc = await createAccount()
        await updateDocument('sessions', {'_id': mongoId(session['_id'])}, {'account': doc.insertedId})
      } else {
        await updateDocument('sessions', {'_id': mongoId(session['_id'])}, {'state': 'registered'})
      }
    }
  }

  return Response.json({})
}