// @ts-nocheck

import { getDocument } from '../mongo'
import { mongoId } from '../utils'

export async function POST(request: Request) {
  console.log('POST orders Nextjs API called')
  const res = await request.json()
  const session = await getDocument('sessions', {'id': res['sessionId']})
  
  if (session['state'] != 'loggedin') {
    return Response.json({'result': 'error'})
  } else {
    const account = await getDocument('accounts', {'_id': mongoId(session['account'])})

    let orders = {'result': 'success', 'items': []}

    for (let i = 0; i < account['orders'].length; i++) {
      let order = {}
      const db_order = await getDocument('orders', {'_id': mongoId(account['orders'][i])})
      order['id'] = db_order['id']
      order['db_id'] = db_order['_id']
      order['order_status'] = db_order['order_status']

      let items = 0
      let total = 0
      for (let x = 0; x < db_order['items'].length; x++) {
        const item = db_order['items'][x]
        const product = await getDocument('products', {'_id': mongoId(item['id'])})
        items += item['amount']
        total += item['amount'] * product['price']
      }

      const config = await getDocument('config', {'type': 'config'})

      if (db_order['user']['shipping']['country'] == "US") {
        total += config['shipping_price']['US']
      } else {
        total += config['shipping_price']['Worldwide']
      }

      order['items'] = items
      order['total'] = total
      orders['items'].push(order)
    }

    return Response.json(orders)
  }
}