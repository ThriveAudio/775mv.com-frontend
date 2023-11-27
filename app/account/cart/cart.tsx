'use client'

import { useAtom } from 'jotai'
import { cartAtom, cartScrollAtom } from './../../../utils/atoms'
import { useReducer, useRef } from 'react'
import Image from 'next/image'
import Link from "next/link"

function itemsReducer(items, action) {
  switch (action.type) {
    case 'checkToggle':
      return items.map((item, i) => {
        if (item['sku'] == action.id) {
          item['checkout'] = action.newCheck
        }
        return item
      })

    case 'updateAmount':
      return items.map((item, i) => {
        if (item['sku'] == action.id) {
          item['amount'] = action.amount
        }
        return item
      })
  
    case 'delete':
      return items.filter((item, i) => {
        return action.id != item['sku']
      })

    default:
      break;
  }
}

export default function Cart({initialItems}: {initialItems: Array<JSON>}) {

  const [items, dispatch] = useReducer(itemsReducer, initialItems)
  const [cart, setCart] = useAtom(cartAtom)
  const [scrollToCart, setScrollToCart] = useAtom(cartScrollAtom)
  const emptyCartText = useRef(null)

  if (scrollToCart) {
    emptyCartText.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    
    let classList = emptyCartText.current.className.split(" ")
    classList.push("text-burgundy")
    emptyCartText.current.className = classList.join(" ")

    setScrollToCart(false)
  }

  async function handleUpdateCheck(e) {
    //while (e.target.id == "") {console.log("waiting for id")}
    //const _id = await e.target.id
    console.log("FIRST")
    //console.log("ID: ", _id)

    //console.log("ITEMS: ", items)
    const temp_item = items.filter((i)=>i['sku']==e) //filter(items, e)  //items.filter((i)=>i['sku']==e.target.id)
    //console.log(temp_item)
    const item = temp_item[0]

    const res = await (await fetch('/api/update-cart', {"method": "post", "body": JSON.stringify({
      "sku": item['sku'],
      "type": "checkout",
      "value": !item['checkout']
    })})).json()
    
    if (res['result'] == "ok") {
      dispatch({
        type: 'checkToggle',
        id: e,
        newCheck: !item['checkout']
      })
    }
  }

  async function handleDecrement(e) {

    const item = items.filter((i)=>i['sku']==e)[0]

    const _amount = (Number(item['amount'])-1).toString()

    const res = await (await fetch('/api/update-cart', {"method": "post", "body": JSON.stringify({
      "sku": item['sku'],
      "type": "amount",
      "value": _amount
    })})).json()

    if (res['result'] == "ok") {
      dispatch({
        type: 'updateAmount',
        id: e,
        amount: _amount
      })
      setCart(cart-1)
    }
  }

  async function handleIncrement(e) {

    const item = items.filter((i)=>i['sku']==e)[0]

    const _amount = (Number(item['amount'])+1).toString()

    const res = await (await fetch('/api/update-cart', {"method": "post", "body": JSON.stringify({
      "sku": item['sku'],
      "type": "amount",
      "value": _amount
    })})).json()

    if (res['result'] == "ok") {
      dispatch({
        type: 'updateAmount',
        id: e,
        amount: _amount
      })
      setCart(cart+1)
    }
  }

  async function handleChange(e) {
    const item = items.filter((i)=>i['sku']==e.target.id)[0]
    const _amount = e.target.value

    const res = await (await fetch('/api/update-cart', {"method": "post", "body": JSON.stringify({
      "sku": item['sku'],
      "type": "amount",
      "value": _amount
    })})).json()

    if (res['result'] == "ok") {
      dispatch({
        type: 'updateAmount',
        id: e.target.id,
        amount: _amount
      })

      fetch('/api/cart').then(e => e.json()).then(e => {
        let amount = 0
        for (let i = 0; i < e.length; i++) {
          amount = amount + Number(e[i]['amount'])
        }
        setCart(amount)
      })
    }
  }

  function handleLostFocus(e) {
    if (e.target.value == "") {
      dispatch({
        type: 'updateAmount',
        id: e.target.id,
        amount: "1"
      })
    }

  }

  async function handleDelete(e) {

    const item = items.filter((i)=>i['sku']==e)[0]

    const res = await (await fetch('/api/update-cart', {"method": "post", "body": JSON.stringify({
      "sku": item['sku'],
      "type": "delete"
    })})).json()

    if (res['result'] == "ok") {
      dispatch({
        type: 'delete',
        id: e
      })
      
      fetch('/api/cart').then(e => e.json()).then(e => {
        let amount = 0
        for (let i = 0; i < e.length; i++) {
          amount = amount + Number(e[i]['amount'])
        }
        setCart(amount)
      })
    }
  }

  const itemComponents = items.map((item, i) => {
    return (
      <div key={i} className="relative flex flex-row min-h-[84px] text-amber border-2 border-coolgraylight bg-coolgraymid rounded-lg m-2 items-center overflow-hidden">
        <Link href={"/product/"+item['sku']} className="relative -ml-[2px] -mt-[2px] -mb-[2px] w-[150px] h-[84px] border-2 border-coolgraylight rounded-lg overflow-hidden">
          <Image src={item['image']} width={150} height={50} alt={item['sku']}/>
          {/* <p className="absolute flex justify-center items-center bottom-0 right-0 w-[35px] h-[24px] px-[5px] rounded-tl-lg text-white font-bold bg-coolgraydark/[0.4]">${item['price']}</p> */}
        </Link>
        <div className="flex flex-col items-start ml-[10px]">
          <Link href={"/product/"+item['sku']} className="hover:underline text-lg mb-12">{item['name']}</Link>
          {/* <p className="text-white font-bold">${item['price']}</p> */}
        </div>
        <p className="ml-10 w-[300px]">{item['description']}</p>
        <p className="absolute right-[239px] text-white font-bold">${item['price']}</p>
        <div className='absolute right-[118px]'>
          <button onClick={() => handleDecrement(item['sku'])} id={item['sku']} className='interactable h-[44px] w-[30px] bg-coolgraydark border-l-2 border-t-2 border-b-2 border-coolgraylight rounded-l-lg active:scale-[95%]'>-</button>
          <input onBlur={handleLostFocus} onInput={handleChange} id={item['sku']} value={item['amount']} className='interactable text-center bg-coolgraydark border-2 border-coolgraylight w-[50px] h-[44px] py-3 active:outline-none focus:outline-none'/>
          <button onClick={() => handleIncrement(item['sku'])} id={item['sku']} className='interactable h-[44px] w-[30px] bg-coolgraydark border-r-2 border-t-2 border-b-2 border-coolgraylight rounded-r-lg active:scale-[95%]'>+</button>
        </div>
        <p className="absolute right-[65px] text-white font-bold">${item['price']*item['amount']}</p>
        {/* <button onClick={() => handleUpdateCheck(item['sku'])} id={item['sku']} className="interactable group flex justify-center items-center absolute right-[64px] w-[44px] h-[44px] bg-coolgraydark hover:bg-viridian transition border-2 border-coolgraylight rounded-lg font-bold">
          {item['checkout'] ? 
          <span className="block w-[12px] h-[12px] bg-amber border-2 border-amber group-hover:bg-white group-hover:border-white transition rounded"></span>
          : 
          <span className="block w-[12px] h-[12px] bg-coolgraydark border-2 border-amber group-hover:bg-viridian group-hover:border-white transition rounded"></span>
          }
        </button> */}
        <button onClick={() => handleDelete(item['sku'])} id={item['sku']} className="interactable absolute right-[10px] h-[44px] w-[44px] border-2 border-coolgraylight rounded-lg bg-coolgraydark text-amber hover:bg-burgundy hover:text-white transition font-bold select-none">X</button>
      </div>
    )
  })

  if (items.length == 0) {
    return (
      <>
        <p ref={emptyCartText} className="mx-auto m-[20px] font-bold text-2xl">Cart is Empty</p>
        <a href="/products" className="mx-auto border-2 border-ochre rounded-lg bg-amber p-2 text-coolgraydark font-bold hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">Browse Products</a>
      </>
    )
  } else {
    return itemComponents
  }
}