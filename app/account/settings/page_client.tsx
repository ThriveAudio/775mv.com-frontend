'use client'

import { useRef, useReducer } from "react"
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
  const router = useRouter()
  const refs = {
    "email": useRef(null),
    "password": useRef(null)
  }

  function handleInput(field) {
    dispatch({
      "type": "input",
      "field": [field],
      "value": refs[[field]].current.value
    })
  }

  // TODO password & email validation

  async function handleSave() {
    const res = await (await fetch('/api/update-settings', {"method": "post", "body": JSON.stringify({
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
          <input ref={refs['email']} onInput={() => handleInput("email")} value={items['email']} autoComplete="email" className="ml-10 w-[300px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <p className="ml-10 mt-5">
            Password
          </p>
          <input ref={refs['password']} onInput={() => handleInput("password")} value={items['password']} autoComplete="password" type="password" className="ml-10 w-[300px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>

          <button onClick={handleSave} disabled={((items['password'] == "") && (initialItems['email'] == items['email']))} className="ml-10 mt-10 max-w-[100px] border-2 border-ochre rounded-lg bg-amber text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:border-coolgraylight disabled:bg-coolgraymid disabled:text-coolgraylight disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none">
            Save
          </button>
        </div>
      </>
    )
  }
}