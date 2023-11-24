'use client'

import { useRouter } from 'next/navigation'
import { useRef, useReducer } from "react"

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
      console.log("error")
    }
  }

  return (
    <>
      <div className="m-2 flex flex-col items-center text-2xl font-bold">
        Register
      </div>
      <div className="mt-[200px] flex flex-col justify-center items-center">
        <input ref={refs.email} onInput={() => handleInputUpdate("email")} value={items['email']} placeholder="Email" autoComplete="email" className="m-2 w-[200px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
        <input ref={refs.password} onInput={() => handleInputUpdate("password")} value={items['password']} placeholder="Password" autoComplete="password" type="password" className="m-2 w-[200px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
        <button onClick={handleSubmit} className="m-2 w-[200px] border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">Register</button>
      </div>
    </>
  )
}