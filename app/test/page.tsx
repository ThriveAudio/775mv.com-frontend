'use client'

// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as Select from '@radix-ui/react-select';
export default function page() {
  fetch("/api/get-products")
  return (
    <>
      <select className='text-amber bg-coolgraymid border-2 border-coolgraylight rounded-lg px-2 py-1'>
        <option>test</option>
        <option>test2</option>
      </select>
    </>
  // <div className="relative mx-auto m-2 w-[500px]">
  //   <span className="absolute w-[125px] h-[25px] bg-lightbg bottom-3.5 left-1/2 -translate-x-1/2 rounded"/>
  //   <PayPalScriptProvider options={{clientId: "test"}}>
  //     <PayPalButtons style={{layout: "vertical"}}/>
  //   </PayPalScriptProvider>
  // </div>
  )
}