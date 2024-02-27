// @ts-nocheck
import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'

export async function GET(request: Request) {
  console.log('GET keep-alive Nextjs API called')
  // const res = {}
  // res['sessionId'] = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/keep-alive', {"method": "post", "body": JSON.stringify(res)})).json()
  // return Response.json(req)
  const sessionId = cookies().get('sessionId')?.value
  const session = await getDocument('sessions', {'id': sessionId})

  if (!session['trusted_device']) {
    if (Date.now()/1000 < session['expiration']) {
      const config = await getDocument('config', {'type': 'config'})
      await updateDocument('sessions', {'id': sessionId}, {'expiration': Date.now()/1000 + config['short_session']})
    }
  }

  return Response.json({})
}