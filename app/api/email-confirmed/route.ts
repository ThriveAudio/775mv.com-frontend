// @ts-nocheck

import { cookies } from 'next/headers'
import { getCollectionAsArray, getDocument } from '../mongo'

export async function POST(request: Request) {
  console.log('POST email-confirmed Nextjs API called')
  const res = await request.json()
  // const sessionId = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/email-confirmed', {"method": "post", "body": JSON.stringify(res)})).json()

  // const session = await getDocument('sessions', {'id': sessionId})
  // const account = await getDocument('accounts', {'_id': session['account']})
  const accounts = await getCollectionAsArray('accounts')

  for (let x = 0; x < accounts.length; x++) {
    const account = accounts[x]
    if (account.email == res.email) {
      return Response.json({"result": true})
    }

    for (let i = 0; i < account.old_emails.length; i++) {
      const email = account.old_emails[i]
      if (email == res.email) {
        return Response.json({"result": true})
      }
    }
  }

  return Response.json({"result": false})
}