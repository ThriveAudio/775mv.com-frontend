// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument } from '../mongo'
const fs = require('fs')

export async function GET(request: Request) {
  console.log('GET cart Nextjs API called')
  const sessionId = cookies().get('sessionId')?.value
  const session = await getDocument('sessions', {'id': sessionId})
  let account = await getDocument('accounts', {'_id': session['account']})

  for (let i = 0; i < account['cart'].length; i++) {
    const dbItem = await getDocument('products', {'sku': account['cart'][i]['sku']})
    account['cart'][i]['price'] = dbItem['price']
    account['cart'][i]['name'] = dbItem['name']
    account['cart'][i]['description'] = dbItem['description']
  }

  const items = account['cart'].map(item => {
    item['image'] = '/'+item['sku']+'/'+fs.readdirSync('./public/'+item['sku'])[0]
    item['amount'] = item['amount'].toString()
    return item
  })

  return Response.json(items)
}