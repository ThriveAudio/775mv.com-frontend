// @ts-nocheck

import { getDocument } from "../mongo"
import { mongoId } from "../utils"

export async function POST(request: Request) {
  const res = await request.json()
  const sessionId = res['sessionId']
  const session = await getDocument('sessions', {'id': sessionId})
  const account = await getDocument('accounts', {'_id': mongoId(session['account'])})

  let response = {'result': 'success'}
  response['email'] = account['email']
  response['oldpassword'] = ''
  response['newpassword'] = ''

  if (session['state'] == 'loggedin') {
    return Response.json(response)
  } else {
    return Response.json({'result': 'error'})
  }
}