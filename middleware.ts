// @ts-nocheck
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // console.log("middleware running")
  const response = NextResponse.next()
  let jsonRes = {}
  if (!request.cookies.has('sessionId')) {
    const res = await fetch(process.env.ROOT_URL+'/api/session-id')
    if (!res.ok) {
      return response
    }
  
    jsonRes = await res.json()

    response.cookies.set("sessionId", jsonRes['sessionId'], {sameSite: false, secure: false})
  }
  
  return response 
}