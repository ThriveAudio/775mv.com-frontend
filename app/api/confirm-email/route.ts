// @ts-nocheck

// TODO testing required

import { cookies } from 'next/headers'
import { mongoId, validateEmail } from '../utils'
import { getCollectionAsArray, getDocument, updateDocument } from '../mongo'
import { randomUUID } from 'crypto'
import { sendTemplate } from '../email'

export async function POST(request: Request) {
  console.log('POST confirm-email Nextjs API called')
  const res = await request.json()
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/confirm-email', {"method": "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)
  const sessionId = cookies().get('sessionId')?.value
  const session = await getDocument('sessions', {'id': sessionId})
  const account_id = mongoId(session['account'])
  const account = await getDocument('accounts', {'_id': account_id})

  console.log('GOT HERE 0')
  
  if (!validateEmail(res['email'])) {
    return Response.json({'result': 'error'})
  }

  console.log('GOT HERE 1')

  if (account['email'] == res['email']) {
    return Response.json({'result': 'confirmed'})
  }

  const accounts = await getCollectionAsArray('accounts')
  for (let i = 0; i < accounts.length; i++) {
    const _account = accounts[i]
    if (res['email'] == _account['email']) {
      return Response.json({'result': 'exists'})
    }
    for (let x = 0; x < _account['old_emails'].length; x++) {
      if (_account['old_emails'][x] == res['email']) {
        return Response.json({'result': 'exists'})
      }
    }
  }

  for (let i = 0; i < account['old_emails'].length; i++) {
    console.log("GOT HERE 2.2")
    const email = account['old_emails'][i]
    if (email == res['email']) {
      account['old_emails'].push(account['email'])
      account['email'] = email
      account['old_emails'].filter((x) => x!=email)

      await updateDocument('accounts', {'_id': account_id}, {'email': account['email']})
      await updateDocument('accounts', {'_id': account_id}, {'old_emails': account['old_emails']})

      return Response.json({'result': 'confirmed'})
    }
  }

  console.log("GOT HERE 3")

  const uid = randomUUID()
  account['new_emails'][uid] = res['email']
  await updateDocument('accounts', {'_id': account_id}, {'new_emails': account['new_emails']})

  sendTemplate(res['email'], '775mv Email Confirmation', 'email-confirmation.html', {'id': uid})
  return Response.json({'result': 'success'})
}