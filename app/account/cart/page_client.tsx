import Cart from "./cart";
import Checkout from "./checkout";

export default function CartPage({initialItems}: {initialItems: Array<JSON>}) {
  return (
    <div className="flex flex-col h-[800px] overflow-y-scroll">
      <Cart initialItems={initialItems}/>
      <Checkout/>
    </div>
  )
}