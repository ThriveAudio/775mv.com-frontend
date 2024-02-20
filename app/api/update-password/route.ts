// @ts-nocheck

import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'
import { mongoId, validatePassword } from '../utils'
let bcrypt = require('bcryptjs')

export async function POST(request: Request) {
  console.log('POST update password Nextjs API called')
  const res = await request.json()
  const sessionId = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/update-password', {"method": "post", "body": JSON.stringify(res)})).json()

  const session = await getDocument('sessions', {'id': sessionId})
  const account = await getDocument('accounts', {'_id': mongoId(session['account'])})

  const old_hash = bcrypt.hashSync(res.items.oldpassword, account.salt)
  if (old_hash != account['password']) {
    return Response.json({'result': 'error'})
  } else {
    if (!validatePassword(res.items.newpassword)) {
      return Response.json({'result': 'error'})
    }
  }

  await updateDocument('accounts', {'_id': mongoId(session['account'])}, {'password': bcrypt.hashSync(res.items.newpassword, account.salt)})
  return Response.json({'result': 'success'})

  // return Response.json(req)
}