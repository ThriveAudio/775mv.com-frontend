// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument } from '../mongo';

export async function GET(request: Request) {
  console.log('GET check-loggedin Nextjs API called')
  // const res = {}
  // console.log("GOT HERE")
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/check-loggedin', {"method": "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)

  const sessionId = cookies().get('sessionId')?.value

  const session = await getDocument("sessions", {"id": sessionId})

  return Response.json({result: session['state'] == "loggedin"})
}