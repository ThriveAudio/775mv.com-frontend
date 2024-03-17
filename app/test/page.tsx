'use client'

import Image from "next/image"
import { Suspense } from "react"
import product from './../../public/product_edited.svg'

// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
export default function page() {
  // fetch("/api/get-products")
  return (
    <Image width={400} height={400} alt={"product img"} src={product} className="bg-transparent"></Image>
  )
}