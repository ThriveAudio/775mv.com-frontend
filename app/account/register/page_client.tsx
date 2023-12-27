'use client'

import { useRouter } from 'next/navigation'
import { useRef, useReducer, useState } from "react"
import { useAtom } from 'jotai'
import { pageBackAtom } from '../../../utils/atoms'

function registerReducer(items, action) {
  switch (action.type) {
    case "input":
      // TODO email validation
      return {
        ...items,
        [action.field]: action.value
      }
  }
}

export default function RegisterClient({redirect}) {

  const initialItems = {
    "email": "",
    "password": "",
    "check": false
  }

  const refs = {
    "email": useRef(null),
    "password": useRef(null)
  }

  const router = useRouter()
  const [items, dispatch] = useReducer(registerReducer, initialItems);
  const [accountExists, setAccountExists] = useState(false)
  const [awaitingEmail, setAwaitingEmail] = useState(false)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [highlightPasswordInfo, setHighlightPasswordInfo] = useState(false)
  const [pageBack, setPageBack] = useAtom(pageBackAtom)
  let emailIntervalRef = useRef(null)
  let passwordInfo = <></>

  if (redirect) {
    router.push("/")
  }

  function handleInputUpdate(field) {

    let classList = refs[[field]].current.className.split(" ")
    classList = classList.filter((item) => item != "!border-burgundy")
    refs[[field]].current.className = classList.join(" ")

    if (field == "password") {
      setHighlightPasswordInfo(false)
    }

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
      setPageBack(true)
      router.back()
    } else if(res['result'] == "error") {
      setAccountExists(true)
    } else if(res['result'] == "password") {
      let classList = refs.password.current.className.split(" ")
      classList.push("!border-burgundy")
      refs.password.current.className = classList.join(" ")
      setHighlightPasswordInfo(true)
    }
  }

  async function handleConfirmEmail() {
    const res = await (await fetch('/api/confirm-email', {"method": "post", "body": JSON.stringify({
      "email": refs.email.current.value
    })})).json()
    console.log(res)
    if (res.result == "error") {
      let classList = refs.email.current.className.split(" ")
      classList.push("!border-burgundy")
      refs.email.current.className = classList.join(" ")
      return
    } else if (res.result == "confirmed") {
      setEmailConfirmed(true)
      return
    }

    setAwaitingEmail(true)

    emailIntervalRef = setInterval(() => {
      const res = fetch('/api/email-confirmed', {"method": "post", "body": JSON.stringify({
        "email": refs.email.current.value
      })}).then((e)=>e.json()).then(e=>{
        if (e['result'] == true) {
          clearInterval(emailIntervalRef)
          setAwaitingEmail(false)
          setEmailConfirmed(true)
        }
      })

    }, 3000)
  }

  // console.log(emailConfirmed)

  function handleCheck() {
    dispatch({
      "type": "input",
      "field": "check",
      "value": !items.check
    })
  }

  if (!emailConfirmed) {
    passwordInfo = <p className='w-[211px] text-xs text-amber/30'>
      The password must have at least 1 of upper and lower case letters, numbers, and special characters.
    </p>
  } else if (highlightPasswordInfo) {
    passwordInfo = <p className='w-[211px] text-xs text-burgundy'>
      The password must have at least 1 of upper and lower case letters, numbers, and special characters.
    </p>
  } else {
    passwordInfo = <p className='w-[211px] text-xs'>
      The password must have at least 1 of upper and lower case letters, numbers, and special characters.
    </p>
  } // password infi show

  return (
    <>
      <div className="m-2 flex flex-col items-center text-2xl font-bold">
        Create Account
      </div>
      <div className="mt-[200px] flex flex-col justify-center items-center">
        <input ref={refs.email} onInput={() => handleInputUpdate("email")} value={items['email']} placeholder="Email" autoComplete="email" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
        {
          awaitingEmail ?
          <p>We sent you a confirmation email. Please check your inbox.</p>
          :
          <></>
        }
        {
          emailConfirmed ?
          <></>
          :
          <button onClick={handleConfirmEmail} className="m-2 w-[211px] border-2 border-ochre rounded-lg p-1 bg-amber text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">
            Confirm Email
          </button>
        }
        <input disabled={!emailConfirmed} ref={refs.password} onInput={() => handleInputUpdate("password")} value={items['password']} placeholder="Password" autoComplete="password" type="password" className="m-2 w-[211px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:placeholder:text-coolgraylight disabled:border-coolgraylight/30"/>
        {passwordInfo}
        <div className="m-1 w-[211px]">
            <input disabled={!emailConfirmed} onClick={handleCheck} type="checkbox" checked={items.check}/>
            {
              emailConfirmed ?
              <label className="ml-2">Trust this device</label>
              :
              <label className="ml-2 text-amber/30">Trust this device</label>
            }
        </div>
        <button disabled={!emailConfirmed} onClick={handleSubmit} className="m-2 w-[211px] border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-ochre/[.01] disabled:bg-ochre/50 disabled:active:shadow-none disabled:hover:shadow-none disabled:hover:scale-100">
          Create Account
        </button>
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