import { cookies } from 'next/headers'

export async function GET(request: Request) {
  console.log('CART Nextjs API called')
  //console.log(cookies().getAll())
  //console.log(request.headers.keys.length)
  const session = cookies().get('sessionId')?.value
  if (session == undefined) {
    console.log('sessionid undefined')
    return Response.json({})
  } else {
    //console.log("SESSION ", session)
    const req = await fetch('http://127.0.0.1:8000/cart', {"method": "post", "body": JSON.stringify({'sessionId': session})})
    const resJson = await req.json()
    console.log("RESPONSE ", resJson)
    return Response.json(resJson)
  }
}