// @ts-nocheck
import PageOrder from "./page_client"
import { cookies } from 'next/headers'
const fs = require('fs');
// import { Server } from "socket.io";

// const io = new Server(8765);

// io.on("connection", (socket) => {
//   console.log("connected: ", socket)
// });

export default async function PageOrderServer({id}) {
  // const session = cookies().get('sessionId')?.value
  // console.log("SESSION: ",session)
  const resJson = await (await fetch(process.env.ROOT_URL+'/api/order', {'method': 'post', 'body': JSON.stringify(id)})).json()
  // console.log("local order response: ", order_res)
  // const req = await fetch('http://127.0.0.1:8000/order/'+id, {"method": "post", "body": JSON.stringify({'sessionId': session})})

  // const resJson = await req.json()
  // console.log("GOT HERE")
  // console.log("RESPONSE JSON ", resJson)

  const newItems = resJson['items'].map(item => {
    item['image'] = '/'+item['sku']+'/'+fs.readdirSync('./public/'+item['sku'])[0]
    item['amount'] = item['amount'].toString()
    return item
  })

  const newJson = {
    ...resJson,
    items: {
      newItems
    }
  }

  // const items = resJson.map(item => {
  //   item['image'] = '/'+item['sku']+'/'+fs.readdirSync('./public/'+item['sku'])[0]
  //   item['amount'] = item['amount'].toString()
  //   return item
  // })


  return (
    <PageOrder order={newJson}/>
  )
}