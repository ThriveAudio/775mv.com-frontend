// @ts-nocheck
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getDocument } from './app/api/mongo'
import { mongoId } from './app/api/utils'

const ignore_urls = ['logout-expired-sessions']
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // console.log("middleware running")
  const response = NextResponse.next()
  let jsonRes = {}
  // console.log(request.url)
  if (!request.cookies.has('sessionId')) {

    let ignore = false
    for (let i = 0; i < ignore_urls.length; i++) {
      if (request.url.endsWith(ignore_urls[i])) {
        ignore = true
      }
    }

    if (!ignore) {
      console.log("creating new account, cookie doesn't exist")
      const res = await fetch(process.env.ROOT_URL+'/api/session-id')
      if (!res.ok) {
        return response
      }
    
      jsonRes = await res.json()

      response.cookies.set("sessionId", jsonRes['sessionId'], {sameSite: false, secure: false})
    }

  } else {
    // sessionId cookie exists
    const sessionId = request.cookies.get('sessionId')
    // const session = await getDocument('sessions', {'id': sessionId})
    const session = await (await fetch(process.env.ROOT_URL+'/api/session-exists', {'method': 'post', 'body': JSON.stringify(sessionId)})).json()
    if (session == false) {
      // session doesn't exist, renew cookie
      console.log("creating new account, session doesn't exist")
      const res = await fetch(process.env.ROOT_URL+'/api/session-id')
      jsonRes = await res.json()
      response.cookies.set("sessionId", jsonRes['sessionId'], {sameSite: false, secure: false})
    } else {
      const account = await (await fetch(process.env.ROOT_URL+'/api/account-exists-by-session', {'method': 'post', 'body': JSON.stringify(sessionId)})).json()
      if (account == false) {
        // account doesn't exist, renew cookie
        console.log("creating new account, account doesn't exist")
        const res = await fetch(process.env.ROOT_URL+'/api/session-id')
        jsonRes = await res.json()
        response.cookies.set("sessionId", jsonRes['sessionId'], {sameSite: false, secure: false})
      }
    }
  }
  
  return response 
}