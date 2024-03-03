// @ts-nocheck
import LogoutClient from './page_client'
import { cookies } from 'next/headers'

export default async function LogoutServer() {
  const session = cookies().get('sessionId')?.value
  const req = await fetch(process.env.ROOT_URL+'/api/logout', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch(process.env.ROOT_URL+'/api/cart')
  const resJson = await req.json()

  return (
    <LogoutClient redirect={resJson['result']}/>
  )
}