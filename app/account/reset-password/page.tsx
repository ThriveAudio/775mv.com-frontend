// @ts-nocheck
'use client'

import { useRef, useState } from "react"
import Link from 'next/link'

export default function Page() {

  const emailRef = useRef(null)
  const [email, setEmail] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleInput() {
    setInvalid(false)
    let classList = emailRef.current.className.split(" ")
    classList = classList.filter((item) => item != "!border-burgundy")
    emailRef.current.className = classList.join(" ")

    setNotFound(false)

    setEmail(emailRef.current.value)
  }

  async function handleSubmit() {
    const res = await (await fetch('/api/email-password-reset', {"method": "post", "body": JSON.stringify({
      email
    })})).json()

    console.log(res)
    if (res['result'] == "invalid") {
      setInvalid(true)
      let classList = emailRef.current.className.split(" ")
      classList.push("!border-burgundy")
      emailRef.current.className = classList.join(" ")
    } else if (res['result'] == "success") {
      setSuccess(true)
    }
  }

  return (
    <div className="mt-[200px] flex flex-col items-center">
      <p>Please enter your account email and we will send you a link to reset your password.</p>
      <div className="w-[211px] flex flex-col">
        <input ref={emailRef} onInput={handleInput} value={email} placeholder="Email" autoComplete="email" className="mt-2 mb-2 border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:text-coolgraylight"/>
        { invalid ? <p>Please enter a valid email address.</p> : <></>}
        <button onClick={handleSubmit} className="mt-2 border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:active:shadow-none">Send Email</button>
      </div>
      { success ? <p className="mt-4 w-[648px] text-center">We will send an email if it has an account.</p> : <p></p> }
    </div>
  )
}