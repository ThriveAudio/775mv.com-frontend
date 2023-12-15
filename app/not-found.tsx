'use client'
import { useState } from "react"

export default function Page() {

  const [buttonVisible, setButtonVisible] = useState(false)

  return (
    <div className="flex flex-col items-center text-amber">
      <div className="font-bold text-2xl mt-10">404 - NOT FOUND</div>
      <div className="mt-2">Oops, looks like you wandered off the beaten track.</div>

      <div className="mt-10">Let's go back home.</div>
      <a href="/products" className="mx-auto mt-2 border-2 border-ochre rounded-lg bg-amber p-2 text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">Home Page</a>

      <div className="mt-10 text-coolgraymid cursor-default">Or you can <span onClick={() => {setButtonVisible(true)}}>go</span> deeper into the forrest.</div>
      {
        buttonVisible ?
        <a href="/forrest" className="transition-all duration-1000 mx-auto mt-2 border-2 border-coolgraymid hover:border-ochre rounded-lg bg-coolgraymid hover:bg-amber p-2 text-coolgraymid hover:text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">Enter the Forrest</a>
        :
        <></>
      }
    </div>
  )
}