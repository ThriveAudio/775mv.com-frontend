// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'

export async function POST(request: Request) {
  console.log("POST update-cart Nextjs API called")
  const res = await request.json()
  const sessionId = cookies().get('sessionId')?.value
  // console.log("API update-cart: ", res)
  // const req = fetch('http://127.0.0.1:8000/update-cart', {"method": "post", "body": JSON.stringify(res)}).catch((e) => {
    // return Response.json({"result": "server offline"})
  // })
  //console.log("API response: ", req)
  // const reqJson = await (await req).json()

  const session = await getDocument('sessions', {'id': sessionId})
  let account = await getDocument('accounts', {'_id': session['account']})

  let result = "ok"

  switch (res['type']) {
    case "amount": {
      let amount = 1
      if (!isNaN(res['value'])) {
        amount = Number(res['value'])
        if (amount < 1) {
          result = "denied"
        } else {
          for (let i = 0; i < account['cart'].length; i++) {
            if (account['cart'][i]['sku'] == res['sku']) {
              account['cart'][i]['amount'] = amount
            }
          }
          await updateDocument('accounts', {'_id': session['account']}, {'cart': account['cart']})
        }
      } else {
        result = "denied"
      }
      break;
    }

    case "delete": {
      account['cart'] = account['cart'].filter((item)=>item['sku']!=res['sku'])
      await updateDocument('accounts', {'_id': session['account']}, {'cart': account['cart']})
      break;
    }
  
    default:
      break;
  }


  return Response.json({"result": result})
}