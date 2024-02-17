import { cookies } from 'next/headers'
import { getCollectionAsArray } from '../mongo'

export async function POST(request: Request) {
  console.log('POST check-account-exists Nextjs API called')
  const res = await request.json()
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/check-account-exists', {"method": "post", "body": JSON.stringify(res)})).json()
  const accounts = await getCollectionAsArray('accounts')
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i]
    if (account.email == res['email'] && account.password.length != 0) {
      return Response.json(true)
    }
  }
  return Response.json(false)
}