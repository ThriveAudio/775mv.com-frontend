// @ts-nocheck
import { cookies } from 'next/headers'
import {getCollectionAsArray} from '../mongo'
const fs = require('fs')

export async function GET(request: Request) {
  console.log('GET get-products Nextjs API called')

  const res = await getCollectionAsArray('products')

  const categories = Array.from(new Set(res.map(product => product['category'])))
  categories.unshift('All')

  const products = res.map(product => {
    product['image'] = '/'+product['sku']+'/'+fs.readdirSync('./public/'+product['sku'])[0]
    return product
  })

  // console.log("CATEGORIES: ", categories)
  // console.log("PRODUCTS: ", products)
  console.log("RES: ", {categories, products})

  return Response.json({categories, products})
}