'use client'

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"

export default function PageCheckout({cart}) {

  // const links = [
  //   {'route': '/account/cart', 'name': 'Cart'},
  //   {'route': '/account/orders', 'name': 'Orders'},
  //   {'route': '/account/data', 'name': 'Personal Data'}
  // ]
  // const currentRoute = usePathname()

  // const linkComponents = links.map((link) => {
  //   if (link['route'] == currentRoute) {
  //     return <Link href={link['route']} className="px-2 py-[1px] hover:bg-coolgraydark border-l-2 border-amber rounded-r-md text-amber font-bold">{link['name']}</Link>
  //   } else {
  //     return <Link href={link['route']} className="px-2 py-[1px] hover:bg-coolgraydark border-l-2 border-ochre rounded-r-md text-ochre">{link['name']}</Link>
  //   }
  // })

  // const refs = Array(100).fill(useRef(null))

  // const tempItems = Array(100).fill(0)
  // const items = tempItems.map((x, i) => <div ref={refs[i]}>1</div>)


  function handleScroll(e) {
    console.log(refs[0].current.getBoundingClientRect())
  }

  const items = cart.map((item, i) => {
    return (
      <div key={i} className="relative flex flex-row text-amber border-2 border-coolgraylight bg-coolgraymid rounded-lg m-2 items-center overflow-hidden">
        <div className="relative -ml-[2px] -mt-[2px] -mb-[2px] w-[150px] h-[84px] border-2 border-coolgraylight rounded-lg overflow-hidden">
          <Image src={item['image']} width={150} height={50} alt={item['sku']}/>
          <p className="absolute flex justify-center items-center bottom-0 right-0 w-[35px] h-[24px] px-[5px] rounded-tl-lg text-white font-bold bg-coolgraydark/[0.4]">${item['price']}</p>
        </div>
        <div className="flex flex-col items-start ml-[10px]">
          <p className="text-lg mb-12">{item['name']}</p>
          {/* <p className="text-white font-bold">${item['price']}</p> */}
        </div>
        <p className="ml-10 w-[400px]">{item['description']}</p>
      </div>
    )
  })

  return (
    <div className="flex flex-row text-amber">
      <div className="flex flex-col w-[150px] h-fit mt-[50px]">
        {/* {linkComponents} */}
      </div>
      <div onScroll={handleScroll} className="relative overflow-y-auto mt-[50px] flex flex-col border-2 h-[800px] w-[1000px] border-coolgraylight bg-coolgraydark rounded-lg">
        <p className="mx-auto m-2 font-bold text-2xl">Checkout Cart</p>
        <p className="mx-auto m-2 border-2 border-coolgraylight rounded-lg p-2 bg-coolgraymid font-bold text-burgundy">
          Double check your items before making the purchase.<br/>
          If anything seems wrong, please go back to the <Link href={"/account/cart"} className="hover:underline text-amber">cart</Link>
        </p>
        {items}
        <p className="mx-auto m-2 font-bold text-2xl">Shipping Details</p>
        <input placeholder="First Name" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
        <input placeholder="Last Name" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
      </div>
    </div>
  )
}