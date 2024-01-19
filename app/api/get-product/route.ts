// @ts-nocheck
import {getDocument} from '../mongo'
const fs = require('fs');

export async function POST(request: Request) {
  console.log('GET get-product Nextjs API called')

  const req = await request.json()
  const sku = req.sku

  const res = await getDocument('products', {'sku': sku})

  res['desc'] = fs.readFileSync('./public/'+sku+'/desc.md', { encoding: 'utf8', flag: 'r' });
  res['specs'] = fs.readFileSync('./public/'+sku+'/specs.md', { encoding: 'utf8', flag: 'r' });
  res['description'] = fs.readFileSync('./public/'+sku+'/short_desc.md', { encoding: 'utf8', flag: 'r' });

  res['images'] = fs.readdirSync('./public/'+sku).map((image: String) => {
    if (!image.endsWith(".md")) {
    return '/'+sku+'/'+image
    }
  })
  res['images'] = res['images'].filter((image) => image != undefined)

  return Response.json(res)
}