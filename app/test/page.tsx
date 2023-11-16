'use client'

// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as Select from '@radix-ui/react-select';
export default function page() {
  return (
    <Select.Root>
    <Select.Trigger>
      <Select.Value placeholder="Select something" />
      <Select.Icon />
    </Select.Trigger>

    <Select.Portal>
      <Select.Content>
        <Select.Viewport>
          <Select.Item value="test">
            <Select.ItemText >test</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>

          <Select.Item value="test2">
            <Select.ItemText >test2</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>

        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
  // <div className="relative mx-auto m-2 w-[500px]">
  //   <span className="absolute w-[125px] h-[25px] bg-lightbg bottom-3.5 left-1/2 -translate-x-1/2 rounded"/>
  //   <PayPalScriptProvider options={{clientId: "test"}}>
  //     <PayPalButtons style={{layout: "vertical"}}/>
  //   </PayPalScriptProvider>
  // </div>
  )
}