// @ts-nocheck

import { cookies } from 'next/headers'
import { mongoId, validatePassword } from '../utils'
import { getCollectionAsArray, getDocument, updateDocument } from '../mongo'
import mongoose from "mongoose"
let bcrypt = require('bcryptjs')

export async function POST(request: Request) {
  console.log('POST register Nextjs API called')
  const res = await request.json()
  const sessionId = cookies().get('sessionId')?.value
  // const req = await (await fetch('http://127.0.0.1:8000/register', {"method": "post", "body": JSON.stringify(res)})).json()
  const config = await getDocument('config', {'type': 'config'})
  const session = await getDocument('sessions', {'id': sessionId})
  let account = await getDocument('accounts', {'_id': new mongoose.Types.ObjectId(session['account'])})

  console.log("sessionId: ", sessionId)
  console.log('res:', res)
  let session_length = 0
  if (res.items.check) {
    session_length = config.long_session
  } else {
    session_length = config.short_session
  }

  if (res.items.email != account.email) {
    console.log(res.items.email, account.email)
    account = await getDocument('accounts', {'email': res.items.email})
    await updateDocument('sessions', {'id': sessionId}, {'account': account['_id']})
  }
    
  if (validatePassword(res.items.password)) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(res.items.password, salt)
    await updateDocument('accounts', {'_id': mongoId(account._id)}, {'salt': salt})
    await updateDocument('accounts', {'_id': mongoId(account._id)}, {'password': hash})
    await updateDocument('sessions', {'id': sessionId}, {'state': 'loggedin'})
    await updateDocument('sessions', {'id': sessionId}, {'expiration': Date.now()/1000 + session_length})
    await updateDocument('sessions', {'id': sessionId}, {'trusted_device': res.items.check})
    return Response.json({'result': 'redirect'})
  } else {
    return Response.json({'result': 'password'})
  }
  // return Response.json(req)
}