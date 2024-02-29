// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'
import { validatePassword } from '../utils'
let bcrypt = require('bcryptjs')

export async function POST(request: Request) {
  console.log('POST password-reset Nextjs API called')
  const res = await request.json()
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/password-reset', {"method": "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)

  const account = await getDocument('accounts', {'password_id': res['id']})

  if (account == null || res['id'].length == 0) {
    return Response.json({'result': 'error'})
  }

  if (!validatePassword(res['password'])) {
    return Response.json({'result': 'invalid'})
  }

  const hash = bcrypt.hashSync(res['password'], account['salt'])
  
  await updateDocument('accounts', {'email': account['email']}, {'password_id': ''})
  await updateDocument('accounts', {'email': account['email']}, {'password': hash})
  return Response.json({'result': 'success'})
}