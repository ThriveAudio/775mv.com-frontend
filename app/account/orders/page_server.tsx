import PageClient from './page_client'
import { cookies } from 'next/headers'

export default async function PageServer() {

  const session = cookies().get('sessionId')?.value
  const req = await fetch(process.env.ROOT_URL+'/api/orders', {"method": "post", "body": JSON.stringify({'sessionId': session})})
  //const res = await fetch(process.env.ROOT_URL+'/api/cart')
  const resJson = await req.json()

  return (
    <PageClient items={resJson}/>
  )
}