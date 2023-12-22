import Cart from "./cart";
import Checkout from "./checkout";

export default function CartPage({initialItems, shippingPrices}: {initialItems: Array<JSON>, shippingPrices: JSON}) {
  return (
    <div className="flex flex-col h-[800px] overflow-y-auto">
      <Cart initialItems={initialItems}/>
      <Checkout shippingPrices={shippingPrices}/>
    </div>
  )
}