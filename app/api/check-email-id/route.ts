// @ts-nocheck

import { getCollectionAsArray, updateDocument } from "../mongo"
import { mongoId } from "../utils"

export async function POST(request: Request) {
  console.log('POST check-email-id Nextjs API called')
  const res = await request.json()
  const id = res['id']
  const accounts = await getCollectionAsArray('accounts')

  for (let x = 0; x < accounts.length; x++) {
    const account = accounts[x]
    const ids = Object.keys(account['new_emails'])
    for (let i = 0; i < ids.length; i++) {
      const _id = ids[i]
      if (id == _id) {
        if (account['email'].length > 0) {
          account['old_emails'].push(account['email'])
        }
        account['email'] = account['new_emails'][id]
        delete account['new_emails'][id]

        const account_id = mongoId(account['_id'])
        await updateDocument('accounts', {'_id': account_id}, {'email': account['email']})
        await updateDocument('accounts', {'_id': account_id}, {'old_emails': account['old_emails']})
        await updateDocument('accounts', {'_id': account_id}, {'new_emails': account['new_emails']})
         
        return Response.json({'result': 'success'})
      }
    }
  }

  return Response.json({'result': 'error'})
}