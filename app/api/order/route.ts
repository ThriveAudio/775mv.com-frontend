// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument } from '../mongo'
import mongoose from "mongoose"
import ObjectID from 'mongodb'


export async function POST(request: Request) {
  console.log('POST order Nextjs API called')

  const res = await request.json()
  const id = new mongoose.Types.ObjectId(res)
  // const id = ObjectID(res.id)
  const order = await getDocument('orders', {'_id': id})
  // console.log("order id: ", id)
  // console.log("ORDER res: ", res)
  // console.log("order: ", order)
  for (let i = 0; i < order['items'].length; i++) {
    const item = order['items'][i]
    const product = await getDocument('products', {'_id': new mongoose.Types.ObjectId(item.id)})
    order['items'][i]['sku'] = product['sku']
    order['items'][i]['price'] = product['price']
  }
  return Response.json(order)
}