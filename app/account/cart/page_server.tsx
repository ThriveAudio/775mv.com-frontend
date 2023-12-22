import CartPage from "./page_client"
import { cookies } from 'next/headers'
const fs = require('fs');
// import { Server } from "socket.io";

// const io = new Server(8765);

// io.on("connection", (socket) => {
//   console.log("connected: ", socket)
// });

export default async function PageCart() {
  const session = cookies().get('sessionId')?.value
  const req = await fetch('http://127.0.0.1:8000/cart', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch('http://127.0.0.1:3000/api/cart')
  const resJson = await req.json()
  console.log("RESPONSE JSON ", resJson)

  const items = resJson.map(item => {
    item['image'] = '/'+item['sku']+'/'+fs.readdirSync('./public/'+item['sku'])[0]
    item['amount'] = item['amount'].toString()
    return item
  })

  const shippingReq = await fetch('http://127.0.0.1:8000/get-shipping-methods', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch('http://127.0.0.1:3000/api/cart')
  const shippingResJson = await shippingReq.json()
  console.log(shippingResJson)


  return (
    <CartPage initialItems={items} shippingPrices={shippingResJson}/>
  )
}