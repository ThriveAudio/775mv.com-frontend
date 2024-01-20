// @ts-nocheck
import { getDocument } from "../mongo";

export async function GET(request: Request) {
  console.log("GET get-shipping-methods NextJS API called")
  const config = await getDocument('config', {'type': 'config'})
  console.log(config['shipping_prices'])
  return Response.json(config['shipping_price'])
}