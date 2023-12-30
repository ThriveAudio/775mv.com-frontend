'use client'

import { useRef, useState } from "react"
import Link from 'next/link'

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [password, setPassword] = useState("")
  const passwordRef = useRef(null)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [invalid, setInvalid] = useState(false)

  function handleInput() {
    setError(false)
    setSuccess(false)
    setInvalid(false)
    let classList = passwordRef.current.className.split(" ")
    classList = classList.filter((item) => item != "!border-burgundy")
    passwordRef.current.className = classList.join(" ")
    setPassword(passwordRef.current.value)
  }

  async function handleSubmit() {
    const res = await (await fetch('/api/password-reset', {"method": "post", "body": JSON.stringify({
      id, password
    })})).json()

    if (res['result'] == "error") {
      setError(true)
    } else if (res['result'] == "success") {
      setSuccess(true)
    } else if (res['result'] == "invalid") {
      setInvalid(true)
      let classList = passwordRef.current.className.split(" ")
      classList.push("!border-burgundy")
      passwordRef.current.className = classList.join(" ")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-[200px] w-[211px] flex flex-col">
        <input ref={passwordRef} onInput={handleInput} value={password} placeholder="Password" autoComplete="password" type="password" className="mt-2 mb-2 border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline disabled:text-coolgraylight"/>
        { invalid
          ?
          <p className="text-sm mb-2">The password must have at least 1 of upper and lower case letters, numbers, and special characters.</p>
          :
          <></>
        }
        <button onClick={handleSubmit} className="mt-2 border-2 border-ochre rounded-lg bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:active:shadow-none">Set New Password</button>
        { success ? <span className="transition-all duration-500 self-center mt-4 h-[3.5px] w-[211px] bg-viridian rounded"/> : <span className="transition-all duration-500 self-center mt-4 h-[3.5px] w-[0px] bg-viridian rounded"/> }
        { success ? <p className="transition-all duration-500 self-center mt-2 text-viridian font-bold overflow-hidden h-[20px]">Password Reset!</p> : <p className="transition-all duration-500 self-center mt-2 text-viridian font-bold overflow-hidden h-[0px]">Email Sent!</p> }
      </div>
      { error ? <p>Something went wrong. We're sorry for the inconvienience. If you're having trouble, please <Link className="underline" href="/contact">contact support</Link>.</p> : <></> }
    </div>
  )
}