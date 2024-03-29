// @ts-nocheck
'use client'

import { useRouter } from 'next/navigation'
import { useRef, useReducer, useState, useEffect } from "react"
import { useAtom } from 'jotai'
import { pageBackAtom } from '../../../utils/atoms'
import Link from 'next/link'

function loginReducer(items, action) {
  switch (action.type) {
    case "input":
      // TODO email validation
      return {
        ...items,
        [action.field]: action.value
      }
  }
}

export default function LoginClient({trustedDevice}) {

  useEffect(() => {
    const checkLoggedin = async () => {
      const data = await (
        await fetch(
          '/api/check-loggedin'
        )
      ).json()

      if (data['result']) {
        router.push("/")
      }
    }

    checkLoggedin()
  }, [])

  const initialItems = {
    "email": "",
    "password": "",
    "check": trustedDevice
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
  const [pageBack, setPageBack] = useAtom(pageBackAtom)

  // if (redirect) {
  //   router.push("/")
  // }

  function handleInputUpdate(field) {
    console.log(refs[[field]].current.value)
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
      setPageBack(true)
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

  function handleCheck() {
    dispatch({
      "type": "input",
      "field": "check",
      "value": !items.check
    })
  }

  return (
    <>
      <div className="m-2 flex flex-col items-center text-2xl font-bold">
        Log In
      </div>
      <div className="mt-[200px] flex flex-col justify-center items-center">
        <input ref={refs.email} disabled={timer > 0} onInput={() => handleInputUpdate("email")} value={items['email']} placeholder="Email" autoComplete="email" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:text-coolgraylight"/>
        <input ref={refs.password} disabled={timer > 0} onInput={() => handleInputUpdate("password")} value={items['password']} placeholder="Password" autoComplete="password" type="password" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:text-coolgraylight"/>
        <div className="m-1 w-[211px]">
            <input onClick={handleCheck} type="checkbox" checked={items.check}/>
            <label className="ml-2">Trust this device</label>
        </div>
        <button onClick={handleSubmit} disabled={timer > 0} className="m-2 w-[211px] border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:active:shadow-none">Login</button>
        <div className='flex flex-row w-[211px] leading-[.60rem] text-ochre'>
          <div className='my-auto mx-1 h-[1px] w-[100px] bg-ochre'></div>
          or
          <div className='my-auto mx-1 h-[1px] w-[100px] bg-ochre'></div>
        </div>
        <a href={"/account/register"} disabled={timer > 0} className="m-2 w-[211px] border-2 border-ochre rounded-lg bg-amber p-1 text-center font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:active:shadow-none">Create Account</a>
        <Link className='underline' href="/account/reset-password">Reset Password</Link>
        {
          timer > 0 ?
          <div className='flex flex-col items-center'>
            <div className='mt-3'>
              Something went wrong.
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
              Something went wrong.
            </div>
            {/* <div className='mt-3'>
              <a href="/account/register" className='mt-2 border-2 border-coolgraylight px-3 py-1 rounded-lg bg-coolgraymid hover:border-ochre'>
                Create Account
              </a>
            </div> */}
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}