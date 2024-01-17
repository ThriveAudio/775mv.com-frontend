// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument } from '../mongo';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  console.log('GET session-id Nextjs API called')
  // const res = {}
  // console.log("GOT HERE")
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/check-loggedin', {"method": "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)

  // const sessionId = cookies().get('sessionId')?.value

  // const session = getDocument("sessions", {"id": sessionId})

  const uid = randomUUID()
  
  return Response.json({sessionId: uid})
}