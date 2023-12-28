import { cookies } from 'next/headers'

export async function POST(request: Request) {
  console.log('POST email-password-reset Nextjs API called')
  const res = await request.json()
  res['sessionId'] = cookies().get('sessionId')?.value
  const req = await (await fetch('http://127.0.0.1:8000/email-password-reset', {"method": "post", "body": JSON.stringify(res)})).json()
  return Response.json(req)
}