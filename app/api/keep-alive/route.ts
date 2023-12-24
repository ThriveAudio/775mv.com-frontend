import { cookies } from 'next/headers'

export async function GET(request: Request) {
  console.log('GET check-loggedin Nextjs API called')
  const res = {}
  console.log("GOT HERE")
  res['sessionId'] = cookies().get('sessionId')?.value
  const req = await (await fetch('http://127.0.0.1:8000/keep-alive', {"method": "post", "body": JSON.stringify(res)})).json()
  return Response.json(req)
}