import RegisterClient from "./page_client"
import { cookies } from 'next/headers'

export default async function RegisterServer() {
  const session = cookies().get('sessionId')?.value
  // const req = await fetch('http://127.0.0.1:3000/api/check-loggedin', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  // //const res = await fetch('http://127.0.0.1:3000/api/cart')
  // const resJson = await req.json()
  
  // if (resJson['result'] == true) {
  //   router.push("/")
  // }
  const trustedCheckReq = await fetch('http://127.0.0.1:3000/api/trusted-check', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch('http://127.0.0.1:3000/api/cart')
  const trustedCheckResJson = await trustedCheckReq.json()
  return (
    <RegisterClient  trustedDevice={trustedCheckResJson}/> // redirect={resJson['result']}
  )
}