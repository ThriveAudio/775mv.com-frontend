// @ts-nocheck
import { cookies } from 'next/headers'
import {getCollectionAsArray} from '../mongo'
const fs = require('fs')

export async function GET(request: Request) {
  console.log('GET get-products Nextjs API called')

  const res = await getCollectionAsArray('products')

  const products = res.map(product => {
    product['image'] = '/'+product['sku']+'/'+fs.readdirSync('./public/'+product['sku'])[0]
    return product
  })

  // await new Promise(resolve => setTimeout(resolve, 3000))
  
  return Response.json(products)
}