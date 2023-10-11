import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const res = await request.json()
  res['sessionId'] = cookies().get('sessionId')?.value
  console.log("API update-cart: ", res)
  const req = fetch('http://127.0.0.1:8000/update-cart', {"method": "post", "body": JSON.stringify(res)}).catch((e) => {
    return Response.json({"result": "server offline"})
  })
  //console.log("API response: ", req)
  const reqJson = await (await req).json()
  return Response.json(reqJson)
}