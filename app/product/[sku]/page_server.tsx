import ProductPage from './page_client'
const fs = require('fs');

export default async function Product({ sku }: { sku: String }) {

  const res = await fetch('http://127.0.0.1:8000/get-product/'+sku);

  if (!res.ok) {
    return {}
  }

  const jsonRes = await res.json()

  jsonRes['images'] = fs.readdirSync('./public/'+jsonRes['sku']).map((image: String) => {
    if (!image.endsWith(".md")) {
    return '/'+jsonRes['sku']+'/'+image
    }
  })

  jsonRes['images'] = jsonRes['images'].filter((image) => image != undefined)

  //jsonRes['image'] = '/'+jsonRes['sku']+'/'+fs.readdirSync('./public/'+jsonRes['sku'])[0]

  return (
    <ProductPage info={jsonRes}/>
  )
}