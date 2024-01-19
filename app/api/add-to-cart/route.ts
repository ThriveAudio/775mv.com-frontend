// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'

export async function POST(request: Request) {
  console.log('POST Nextjs API called')
  const res = await request.json()
  const sessionId = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/add-to-cart', {"method": "post", "body": JSON.stringify(res)})).json()
  const session = await getDocument('sessions', {'id': sessionId})
  const account = await getDocument('accounts', {'_id': session['account']})

  // Find product index in cart
  let cartIndex = -1
  for (let i = 0; i < account['cart'].length; i++) {
    if (account['cart'][i]['sku'] == res['sku']) {
      cartIndex = i
    }
  }

  if (cartIndex != -1) {
    account['cart'][cartIndex]['amount'] += res['amount']
  } else {
    account['cart'].push({
      'sku': res['sku'],
      'amount': res['amount']
    })
  }

  await updateDocument('accounts', {'_id': session['account']}, {'cart': account['cart']})

  return Response.json(res)
}