// @ts-nocheck
import { cookies } from 'next/headers'
import { validateEmail } from '../utils'
import { getDocument, updateDocument } from '../mongo'
import { randomUUID } from 'crypto'
import { sendTemplate } from '../email'

export async function POST(request: Request) {
  console.log('POST email-password-reset Nextjs API called')
  const res = await request.json()
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/email-password-reset', {"method": "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)
  const sessionId = cookies().get('sessionId')?.value
  
  if (!validateEmail(res['email'])) {
    return Response.json({'result': 'invalid'})
  }

  const account = await getDocument('accounts', {'email': res['email']})

  if (account != null) {
    const uid = randomUUID()
    await updateDocument('accounts', {'email': res['email']}, {'password_id': uid})
    sendTemplate(res['email'], 'TEST 775mv Password Reset', 'password-reset.html', {'id': uid})
  }

  return Response.json({'result': 'success'})
}