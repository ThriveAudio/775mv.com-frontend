// @ts-nocheck
import { cookies } from 'next/headers'
import {getCollectionAsArray} from '../mongo'

export async function GET(request: Request) {
  console.log('GET get-products Nextjs API called')

  const res = await getCollectionAsArray('products')

  return Response.json(res)
}