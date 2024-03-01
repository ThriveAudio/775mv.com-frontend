// @ts-nocheck

import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'
import { createOrder, mongoId, newOrderId, orderAddPaypal, renderEmailInfo } from '../utils'
import { sendTemplate } from '../email'

export async function POST(request: Request) {
  console.log('POST paypal-approve-order Nextjs API called')
  const res = await request.json()
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/paypal-approve-order', {'method': "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)
  
  const sessionId = cookies().get('sessionId')?.value
  const session = await getDocument('sessions', {'id': sessionId})
  const account = await getDocument('accounts', {'_id': mongoId(session['account'])})
  const config = await getDocument('config', {'type': 'config'})
  const order_id = await newOrderId()


  /// create order
  const order_db_id = await createOrder(account, res, order_id)
  await orderAddPaypal(order_db_id, res['paypal'])

  
  /// update account with order
  account['orders'].push(order_db_id)
  await updateDocument('accounts', {'_id': mongoId(session['account'])}, {'orders': account['orders']})


  /// setup info for emails
  const email_info = await renderEmailInfo(account, res, config, true)


  /// send emails

  // send customer email
  sendTemplate(res.items.shipping.email, `DEV 775mv TEST Order #${order_id} confirmation`, 'order-confirmation.html', {
    order_id: order_id,
    order_db_id: order_db_id,
    info: email_info
  })

  // send new order email
  sendTemplate('thriveaudiollc@gmail.com', `TEST New Order #${order_id} | ${email_info.user.first_name} ${email_info.user.last_name}`, 'new-order.html', {
    info: email_info
  })

  return Response.json({'result': `success ${order_db_id}`})
}