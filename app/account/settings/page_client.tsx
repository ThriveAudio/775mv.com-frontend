'use client'

import { useRef, useReducer, useState } from "react"
import { useRouter } from 'next/navigation'

function settingsReducer(items, action) {
  switch (action.type) {
    case "input":
      return {
        ...items,
        [action.field]: action.value
      }
  
    default:
      break;
  }
}

export default function PageClient({initialItems}) {
  const [items, dispatch] = useReducer(settingsReducer, initialItems);
  const [awaitingEmail, setAwaitingEmail] = useState(false)
  const [emailConfirmed, setEmailConfirmed] = useState(true)
  const [passwordError, setPasswordError] = useState(false)
  let emailIntervalRef = useRef(null)
  const router = useRouter()
  const refs = {
    "email": useRef(null),
    "oldpassword": useRef(null),
    "newpassword": useRef(null)
  }

  function handleInput(field) {
    dispatch({
      "type": "input",
      "field": [field],
      "value": refs[[field]].current.value
    })

    let classList = refs[[field]].current.className.split(" ")
    classList = classList.filter((item) => item != "!border-burgundy")
    refs[[field]].current.className = classList.join(" ")

    if (field == "oldpassword" || field == "newpassword") {
      setPasswordError(false)
    }
  }

  // TODO password & email validation

  async function handleSave() {
    const res = await (await fetch('/api/update-password', {"method": "post", "body": JSON.stringify({
      items
    })})).json()
    const slice = res['result'].split(" ")
    switch (slice[0]) {
      case "success":
        dispatch({
          "type": "input",
          "field": "password",
          "value": ""
        })
        router.refresh()
        break;

      case "error":
        switch (slice[1]) {
          case "email":
            console.log("bad email")
            break;

          case "password":
            console.log("bad password")
            break;
        
          default:
            break;
        }
    
      default:
        break;
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
      router.refresh()
      return
    }

    setAwaitingEmail(true)

    emailIntervalRef = setInterval(() => {
      const res = fetch('/api/email-confirmed', {"method": "post", "body": JSON.stringify({
        "email": items.email
      })}).then((e)=>e.json()).then(e=>{
        if (e['result'] == true) {
          clearInterval(emailIntervalRef)
          setAwaitingEmail(false)
          router.refresh()
        }
      })

    }, 3000)
  }

  async function handleSavePassword() {
    const res = await (await fetch('/api/update-password', {"method": "post", "body": JSON.stringify({
      items
    })})).json()

    switch (res['result']) {
      case "success": {
        dispatch({
          "type": "input",
          "field": "oldpassword",
          "value": ""
        })
        dispatch({
          "type": "input",
          "field": "newpassword",
          "value": ""
        })
        router.refresh()
        break;
      }

      case "error": {
        let classList = refs.oldpassword.current.className.split(" ")
        classList.push("!border-burgundy")
        refs.oldpassword.current.className = classList.join(" ")
        classList = refs.newpassword.current.className.split(" ")
        classList.push("!border-burgundy")
        refs.newpassword.current.className = classList.join(" ")
        setPasswordError(true)
        break;
      }
    
      default:
        break;
    }
  }

  if (initialItems['result'] == "error") {
    return (
      <>
        <div className="flex flex-col items-center">
          <p className="m-2 text-2xl font-bold">
            Settings
          </p>
          <p className="mt-[200px]">
            Please login to view the settings.
          </p>
          <a href="/account/login" className="m-4 w-[253px] border-2 border-ochre rounded-lg text-center bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:text-coolgraylight disabled:bg-coolgraymid disabled:border-coolgraylight">
            Login
          </a>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="flex flex-col items-center">
          <p className="m-2 text-2xl font-bold">
            Settings
          </p>
        </div>
        <div className="flex flex-col">
          <p className="ml-10 mt-10">
            Email
          </p>
          <div className="flex flex-row">
            <input ref={refs['email']} onInput={() => handleInput("email")} value={items['email']} autoComplete="email" className="ml-10 w-[300px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <button onClick={handleConfirmEmail} disabled={(initialItems['email'] == items['email'])} className="ml-4 px-2 py-1 min-w-[130px] border-2 border-ochre rounded-lg bg-amber text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none">
              Save Email
            </button>
          </div>
          {
            awaitingEmail ?
            <p className="ml-10 mt-2 text-sm">
              We sent you a confirmation email. Please check your inbox.
            </p>
            :
            <></>
          }

          <div className="flex flex-col w-[340px]">
            <p className="ml-10 mt-5">
              Password
            </p>
            <input ref={refs['oldpassword']} onInput={() => handleInput("oldpassword")} value={items['oldpassword']} placeholder="Current Password" autoComplete="password" type="password" className="ml-10 w-[300px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs['newpassword']} onInput={() => handleInput("newpassword")} value={items['newpassword']} placeholder="New Password" type="password" className="ml-10 mt-2 w-[300px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <p className="ml-10 mt-2 text-xs">
              The password must have at least 1 of upper and lower case letters, numbers, and special characters.
            </p>
            {
              passwordError ?
              <p className="ml-10 mt-2 text-xs text-burgundy">
                Something went wrong, please check that the current password is correct and the new password complies with all the requirements listed above.
              </p>
              :
              <p></p>
            }
            <button onClick={handleSavePassword} disabled={!(items['oldpassword'] != "" && items['newpassword'] != "")} className="self-end mt-2 px-2 py-1 w-[130px] border-2 border-ochre rounded-lg bg-amber text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none">
              Save Pass
            </button>
          </div>
          {/* <button onClick={handleSave} disabled={((items['password'] == "") && (initialItems['email'] == items['email']))} className="ml-10 mt-10 max-w-[100px] border-2 border-ochre rounded-lg bg-amber text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none">
            Save
          </button> */}
        </div>
      </>
    )
  }
}