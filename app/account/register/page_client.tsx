'use client'

import { useRouter } from 'next/navigation'
import { useRef, useReducer, useState } from "react"

function registerReducer(items, action) {
  switch (action.type) {
    case "input":
      if (action.field == "email") {
        // TODO email validation
        return {
          ...items,
          email: action.value
        }
      } else if (action.field == "password") {
        return {
          ...items,
          password: action.value
        }
      }
  }
}

export default function RegisterClient({redirect}) {

  const initialItems = {
    "email": "",
    "password": ""
  }

  const refs = {
    "email": useRef(null),
    "password": useRef(null)
  }

  const router = useRouter()
  const [items, dispatch] = useReducer(registerReducer, initialItems);
  const [accountExists, setAccountExists] = useState(false)

  if (redirect) {
    router.push("/")
  }

  function handleInputUpdate(field) {
    dispatch({
      "type": "input",
      "field": field,
      "value": refs[[field]].current.value
    })
  }

  async function handleSubmit() {
    const res = await (await fetch('/api/register', {"method": "post", "body": JSON.stringify({
      items
    })})).json()

    if (res['result'] == "redirect") {
      router.back()
    } else if(res['result'] == "error") {
      setAccountExists(true)
    }
  }

  return (
    <>
      <div className="m-2 flex flex-col items-center text-2xl font-bold">
        Create Account
      </div>
      <div className="mt-[200px] flex flex-col justify-center items-center">
        <input ref={refs.email} onInput={() => handleInputUpdate("email")} value={items['email']} placeholder="Email" autoComplete="email" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
        <input ref={refs.password} onInput={() => handleInputUpdate("password")} value={items['password']} placeholder="Password" autoComplete="password" type="password" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
        <button onClick={handleSubmit} className="m-2 w-[211px] border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">Create Account</button>
        {
          accountExists ?
          <div className='flex flex-col'>
            <div className='mt-3'>
              This account already exists.
            </div>
            <button className='mt-2 border-2 border-coolgraylight py-1 rounded-lg bg-coolgraymid hover:border-ochre'>
              Reset Password
            </button> {/* TODO make the reset password button work */}
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}