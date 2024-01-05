import { cookies } from 'next/headers'

export async function GET() {
  console.log('POST paypal-create-order Nextjs API called')
  const req = await (await fetch('http://127.0.0.1:8000/paypal-create-order')).json()
  return Response.json(req)
}