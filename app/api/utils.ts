// @ts-nocheck
import { addDocument } from './mongo';

export async function createAccount() {
  return await addDocument('accounts', {
    "new_emails": {},
    "email": "",
    "old_emails": [],
    "password": "",
    "password_id": "",
    "salt": "",
    "timer_var": 0,
    "timer": 0,
    "cart": [],
    "orders": [],
    "access_timestamps": []
  })
}