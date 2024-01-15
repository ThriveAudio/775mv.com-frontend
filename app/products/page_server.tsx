// @ts-nocheck
import Page from './page_client';
const fs = require('fs');

export default async function Products() {

  const res = await fetch('http://127.0.0.1:3000/api/get-products');

  if (!res.ok) {
    return {}
  }

  const jsonRes = await res.json()

  console.log("PRODUCTS: ", jsonRes)

  const categories = Array.from(new Set(jsonRes.map(product => product['category'])))
  categories.unshift('All')

  const products = jsonRes.map(product => {
    product['image'] = '/'+product['sku']+'/'+fs.readdirSync('./public/'+product['sku'])[0]
    return product
  })

  return (
    <>
      <Page categories={categories} products={products}/>
    </>
  )
}
