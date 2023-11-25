'use client'

import { useRouter } from 'next/navigation'
import { useRef, useReducer, useState } from "react"

function loginReducer(items, action) {
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

export default function LoginClient({redirect}) {

  const initialItems = {
    "email": "",
    "password": ""
  }

  const refs = {
    "email": useRef(null),
    "password": useRef(null)
  }

  const router = useRouter()
  const [items, dispatch] = useReducer(loginReducer, initialItems);
  const [accountExists, setAccountExists] = useState(false)
  const [expTime, setExpTime] = useState(0)
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef(null)
  const [wrongLogin, setWrongLogin] = useState(false)

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
    const res = await (await fetch('/api/login', {"method": "post", "body": JSON.stringify({
      items
    })})).json()

    const slice = res['result'].split(" ")

    console.log(slice)

    if (slice[0] == "redirect") {
      router.back()
    } else if(slice[0] == "error") {
      if (slice[1] == "-1") {
        setWrongLogin(true)
      } else {
        setWrongLogin(false)
        setTimer(Math.round(Number(slice[1]) - Date.now()/1000))
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
          setTimer(timer => timer-1)
          }, 1000
        )
      }
    }
  }
  console.log(timer)
  return (
    <>
      <div className="m-2 flex flex-col items-center text-2xl font-bold">
        Log In
      </div>
      <div className="mt-[200px] flex flex-col justify-center items-center">
        <input ref={refs.email} disabled={timer > 0} onInput={() => handleInputUpdate("email")} value={items['email']} placeholder="Email" autoComplete="email" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:text-coolgraylight"/>
        <input ref={refs.password} disabled={timer > 0} onInput={() => handleInputUpdate("password")} value={items['password']} placeholder="Password" autoComplete="password" type="password" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:text-coolgraylight"/>
        <button onClick={handleSubmit} disabled={timer > 0} className="m-2 w-[211px] border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:text-coolgraylight disabled:bg-coolgraymid disabled:border-coolgraylight">Login</button>
        {
          timer > 0 ?
          <div className='flex flex-col items-center'>
            <div className='mt-3'>
              Incorrect Login
            </div>
            <div className='mt-3'>
              Please wait
            </div>
            <div>
              {timer} seconds.
            </div>
          </div>
          :
          <></>
        }
        {
          wrongLogin ?
          <div className='flex flex-col items-center'>
            <div className='mt-3'>
              Incorrect Login
            </div>
            <div className='mt-3'>
              <a href="/account/register" className='mt-2 border-2 border-coolgraylight px-3 py-1 rounded-lg bg-coolgraymid hover:border-ochre'>
                Create Account
              </a>
            </div>
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}