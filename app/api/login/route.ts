// @ts-nocheck

import { cookies } from 'next/headers'
import { getDocument, updateDocument } from '../mongo'
import { mongoId } from '../utils'
let bcrypt = require('bcryptjs')

export async function POST(request: Request) {
  console.log('POST login Nextjs API called')
  const res = await request.json()
  const sessionId = cookies().get('sessionId')?.value
  const config = await getDocument('config', {'type': 'config'})
  // const req = await (await fetch('http://127.0.0.1:8000/login', {"method": "post", "body": JSON.stringify(res)})).json()

  let account = await getDocument('accounts', {'email': res.items.email})

  let session_length = 0
  if (res.items.check) {
    session_length = config.long_session
  } else {
    session_length = config.short_session
  }

  if (account == null) {
    return Response.json({'result': 'error -1'})
  } else {
    await updateDocument('sessions', {'id': sessionId}, {'account': mongoId(account['_id'])})
    const hash = bcrypt.hashSync(res.items.password, account.salt)
    if (account.password == hash) {
      // passwords match
      await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer_var': 0})
      await updateDocument('sessions', {'id': sessionId}, {'state': 'loggedin'})
      await updateDocument('sessions', {'id': sessionId}, {'expiration': Date.now()/1000 + session_length})
      await updateDocument('sessions', {'id': sessionId}, {'trusted_device': res.items.check})
      return Response.json({'result': 'redirect'})
    } else {
      // passwords don't match
      if (account['timer_var'] == 0) {
        // timer_var is zero
        await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer_var': account['timer_var']+5})
        await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer': Date.now()/1000 + account['timer_var']+5})
        return Response.json({'result': `error ${Date.now()/1000 + account['timer_var']+5+1}`})
      } else {
        // timer_var is more than zero
        if (account['timer'] < Date.now()/1000) {
          // timer expired
          await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer_var': account['timer_var']+5})
          await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer': Date.now()/1000 + account['timer_var']+5})
          return Response.json({'result': `error ${Date.now()/1000 + account['timer_var'] + 5+1}`})
        } else {
          // timer still ticking
          await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer_var': account['timer_var'] * 2})
          await updateDocument('accounts', {'_id': mongoId(account['_id'])}, {'timer': account['timer'] + account['timer_var'] * 2})
          return Response.json({'result': `error ${account['timer'] + account['timer_var'] * 2 + 1}`})
        }
      }
      

    }
  }
}