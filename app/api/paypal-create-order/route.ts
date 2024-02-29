// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'
import { randint } from '../utils'

export async function GET() {
  console.log('POST paypal-create-order Nextjs API called')
  // const req = await (await fetch('http://127.0.0.1:8000/paypal-create-order')).json()
  // return Response.json(req)
  // TODO change last order id to config
  const last_id = (await getDocument('orders', {'type': 'last_id'}))['id']
  const new_id = last_id + randint(13)
  await updateDocument('orders', {'type': 'last_id'}, {'id': new_id})
  return Response.json(new_id)
}