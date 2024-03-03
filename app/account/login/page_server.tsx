import LoginClient from "./page_client"
import { cookies } from 'next/headers'

export default async function RegisterServer() {
  const session = cookies().get('sessionId')?.value
  // const req = await fetch(process.env.ROOT_URL+'/api/check-loggedin', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  // //const res = await fetch(process.env.ROOT_URL+'/api/cart')
  // const resJson = await req.json()
  // if (resJson['result'] == true) {
  //   router.push("/")
  // }
  const trustedCheckReq = await fetch(process.env.ROOT_URL+'/api/trusted-check', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch(process.env.ROOT_URL+'/api/cart')
  const trustedCheckResJson = await trustedCheckReq.json()
  return (
    <LoginClient  trustedDevice={trustedCheckResJson}/> // redirect={resJson['result']}
  )
}