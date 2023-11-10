'use client'

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function page() {
  return (
  <div className="relative mx-auto m-2 w-[500px]">
    <span className="absolute w-[125px] h-[25px] bg-lightbg bottom-3.5 left-1/2 -translate-x-1/2 rounded"/>
    <PayPalScriptProvider options={{clientId: "test"}}>
      <PayPalButtons style={{layout: "vertical"}}/>
    </PayPalScriptProvider>
  </div>
  )
}