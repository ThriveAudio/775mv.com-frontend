// @ts-nocheck
'use client'
import { useEffect, useState } from "react";
import Cart from "./cart";
import Checkout from "./checkout";

export default function Page() {

  const [cart, setCart] = useState([])
  const [shippingPrices, setShippingPrices] = useState({})

  useEffect(() => {
    const fetchCart = async () => {
      const data = await (
        await fetch(
          'http://127.0.0.1:3000/api/cart'
        )
      ).json()

      console.log("DATA", data)
      setCart(data)
    }

    const fetchShippingPrices = async () => {
      const data = await (
        await fetch(
          'http://127.0.0.1:3000/api/get-shipping-methods'
        )
      ).json()

      console.log("DATA", data)
      setShippingPrices(data)
    }

    fetchCart()
    fetchShippingPrices()
  }, [])


  if (shippingPrices['US'] == undefined) {
    return (
      <></>
    )
  }
  return (
    <div className="flex flex-col h-[800px] overflow-y-auto">
      <Cart initialItems={cart}/>
      <Checkout shippingPrices={shippingPrices}/>
    </div>
  )
}