// @ts-nocheck
import PageClient from './page_client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function PageServer({id}) {

  const session = cookies().get('sessionId')?.value
  const req = await fetch('http://127.0.0.1:8000/check-email-id/'+id, {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch('http://127.0.0.1:3000/api/cart')
  const resJson = await req.json()

  if (resJson.result == "error") {
    redirect("/404")
  } else {
    return (<PageClient/>)
  }
}