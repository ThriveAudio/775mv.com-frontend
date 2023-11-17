'use client'

import Link from "next/link"
import { useState, useRef, useReducer } from "react"
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { cartAtom } from './../../../utils/atoms'
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, CheckboxIcon } from '@radix-ui/react-icons';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import RightChevron from "./../../../public/right_chevron.png"
// import { HostedForm } from 'react-acceptjs';
import GooglePayButton from "@google-pay/button-react";
// import { io } from "socket.io-client"

// const socket = io()

// socket.on("connect", () => {
//   console.log("connected")
// })

// function filter(array: Array<any>, check: String) {
//   let newArray = []

//   console.log(array)

//   for (let i = 0; i < array.length; i++) {
//     console.log(array[i]['sku'], " - ", check)
//     if (array[i]['sku'] == check) {
//       //console.log(array[i])
//       newArray.push(array[i])
//     }
//   }

//   return newArray
// }
/*
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
          {/* <p className="absolute flex justify-center items-center bottom-0 right-0 w-[35px] h-[24px] px-[5px] rounded-tl-lg text-white font-bold bg-coolgraydark/[0.4]">${item['price']}</p> }
        </Link>
        <div className="flex flex-col items-start ml-[10px]">
          <Link href={"/product/"+item['sku']} className="hover:underline text-lg mb-12">{item['name']}</Link>
          {/* <p className="text-white font-bold">${item['price']}</p> }
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
        </button> }
        <button onClick={() => handleDelete(item['sku'])} id={item['sku']} className="interactable absolute right-[10px] h-[44px] w-[44px] border-2 border-coolgraylight rounded-lg bg-coolgraydark text-amber hover:bg-burgundy hover:text-white transition font-bold select-none">X</button>
      </div>
    )
  })*/

function checkoutReducer(items, action) {
  switch (action.type) {
    case "paymentMethod": {
      return {
        ...items,
        payment: {
          ...items.payment,
          type: action.paymentMethod
        }
      }
    }
    
    case "cardNumber": {
      const value = action.cardNumber.replaceAll(" ", "")
      console.log(value)
      if (!isNaN(value) && value.length <= 16) {
        let newValue = ""
        for (let i = 0; i < value.length; i++) {
          newValue += value[i]
          if ((i+1)%4 == 0 && i < value.length-1) {
            newValue += " "
          }
        }
        
        return {
          ...items,
          payment: {
           ...items.payment,
             "cc-number": newValue
           }
        }
      }
      break;
    }

    case "cardExp": {
      const value = action.cardExp.replaceAll("/", "").replaceAll(" ", "")
      console.log(value)
      if (!isNaN(value) && value.length <= 4) {
        let newValue = ""
        for (let i = 0; i < value.length; i++) {
          newValue += value[i]
          if ((i+1)%2 == 0 && i < value.length-1) {
            newValue += "/"
          }
        }
        
        return {
          ...items,
          payment: {
           ...items.payment,
             "cc-exp": newValue
           }
        }
      }
      break;
    }

    case "cardCVV": {
      const value = action.cardCVV.replaceAll(" ", "")
      if (!isNaN(value) && value.length <= 3) {

        return {
          ...items,
          payment: {
           ...items.payment,
             "cc-cvv": value
           }
        }
      }
      break;
    }

    case "billingCheck": {
      return {
        ...items,
        billing: {
          ...items.billing,
            "same_as_shipping": action.billingCheck
        }
      }
    }

    case "shipping": {
      return {
       ...items,
         shipping: {
         ...items.shipping,
            [action.field]: action.value
         }
      }
    }

    case "billing": {
      return {
       ...items,
         billing: {
         ...items.billing,
            [action.field]: action.value
         }
      }
    }

    case "payment": {

      switch (action.field) {
        case "cc-number": {
          const value = action.value.replaceAll(" ", "")
          if (!isNaN(value) && value.length <= 16) {
            let newValue = ""
            for (let i = 0; i < value.length; i++) {
              newValue += value[i]
              if ((i+1)%4 == 0 && i < value.length-1) {
                newValue += " "
              }
            }

            return {
              ...items,
                payment: {
                ...items.payment,
                   [action.field]: newValue
                }
            }
          }
          break;
        }

        case "cc-exp": {
          const value = action.value.replaceAll("/", "").replaceAll(" ", "")
          if (!isNaN(value) && value.length <= 4) {
            let newValue = ""
            for (let i = 0; i < value.length; i++) {
              newValue += value[i]
              if ((i+1)%2 == 0 && i < value.length-1) {
                newValue += "/"
              }
            }

            return {
              ...items,
                payment: {
                ...items.payment,
                   [action.field]: newValue
                }
            }
          }
        }

        case "cc-cvv": {
          const value = action.value.replaceAll(" ", "")
          if (!isNaN(value) && value.length <= 3) {
            return {
              ...items,
                payment: {
                ...items.payment,
                   [action.field]: value
                }
            }
          }
        }
      
        default:
          break;
      }
    }

    case "expanded": {
      return {
      ...items,
        expanded: {
          ...items.expanded,
          [action.field]: action.value
        }
      }
    }
  
    default:
      break;
  }
  return items
}

function Expandable({children, title, expanded, handleExpansion, expansionType}) {
  if (expanded) {
    return (
      <div className="transition-all ease-in duration-150 m-2 flex flex-col max-h-[600px] border-coolgraylight border-2 rounded-lg overflow-hidden">
        <button onClick={() => handleExpansion(expansionType)} className="relative flex">
          <div className="transition-all absolute w-[20px] h-[20px] left-2 inset-y-1/2 -translate-y-1/2 rotate-90">
            <div className="relative w-[20px] h-[20px]">
              <span className="absolute top-[4.5px] block bg-white h-[3px] w-[20px] rounded rotate-[26.56deg]"/>
              <span className="absolute bottom-[4.5px] block bg-white h-[3px] w-[20px] rounded -rotate-[26.56deg]"/>
            </div>
          </div>
          <p className="mx-auto m-2 font-bold text-2xl">{title}</p>
        </button>
        {children}
      </div>
    )
  } else {
    return (
      <div className="transition-all ease-out duration-150 m-2 flex flex-col max-h-[55px] border-coolgraylight border-2 rounded-lg overflow-hidden">
        <button onClick={() => handleExpansion(expansionType)} className="relative flex">
          <div className="transition-all absolute w-[20px] h-[20px] left-2 inset-y-1/2 -translate-y-1/2 rotate-0">
            <div className="relative w-[20px] h-[20px]">
              <span className="absolute top-[4.5px] block bg-white h-[3px] w-[20px] rounded rotate-[26.56deg]"/>
              <span className="absolute bottom-[4.5px] block bg-white h-[3px] w-[20px] rounded -rotate-[26.56deg]"/>
            </div>
          </div>
          <p className="mx-auto m-2 font-bold text-2xl">{title}</p>
        </button>
        {children}
      </div>
    )
  }
}

export default function Checkout() {

  const initialItems = {
    "shipping": {
      "first_name": "",
      "last_name": "",
      "email": "",
      "address1": "",
      "address2": "",
      "city": "",
      "state": "",
      "zip": "",
      "country": "",
    },
    "billing": {
      "same_as_shipping": false,
      "first_name": "",
      "last_name": "",
      "address1": "",
      "address2": "",
      "city": "",
      "state": "",
      "zip": "",
      "country": "",
    },
    "payment": {
       "type": "credit",
       "cc-number": "",
       "cc-exp": "",
       "cc-cvv": ""
    },
    "expanded": {
      "shipping": false,
      "billing": false,
      "payment": false,
      "shipping method": false
    }
  }

  const refs = {
    "shipping": {
      "first_name": useRef(null),
      "last_name": useRef(null),
      "email": useRef(null),
      "address1": useRef(null),
      "address2": useRef(null),
      "city": useRef(null),
      "state": useRef(null),
      "zip": useRef(null),
      "country": useRef(null),
    },
    "billing": {
      "first_name": useRef(null),
      "last_name": useRef(null),
      "address1": useRef(null),
      "address2": useRef(null),
      "city": useRef(null),
      "state": useRef(null),
      "zip": useRef(null),
      "country": useRef(null),
    },
    "payment": {
      "cc-number": useRef(null),
      "cc-exp": useRef(null),
      "cc-cvv": useRef(null)
    }
  }

  const [items, dispatch] = useReducer(checkoutReducer, initialItems);
  const router = useRouter()

  function getCountries(lang = 'en') {
    const A = 65
    const Z = 90
    const countryName = new Intl.DisplayNames([lang], { type: 'region' });
    const countries = []
    for(let i=A; i<=Z; ++i) {
        for(let j=A; j<=Z; ++j) {
            let code = String.fromCharCode(i) + String.fromCharCode(j)
            let name = countryName.of(code)
            if (code !== name) {
                countries.push({[code]: name})
            }
        }
    }
    return countries
  }
  // console.log(getCountries())

  let cartJSX = <div/>
  const [billing, setBilling] = useState(true);

  function handleBillingCheck() {
    dispatch({
      type: 'billingCheck',
      billingCheck: !items.billing['same_as_shipping']
    })
  }

  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["MASTERCARD", "VISA"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example"
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant"
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "100.00",
      currencyCode: "USD",
      countryCode: "US"
    }
  };

  const authData = {
    apiLoginID: '34UTh2qF6d',
    clientKey: '399q99EAzudDCP8P',
  };

  function handleSwitchToCredit() {
    dispatch({
      type: 'paymentMethod',
      paymentMethod: "credit"
    })
  }

  function handleSwitchToPaypal() {
    dispatch({
      type: 'paymentMethod',
      paymentMethod: "paypall"
    })
  }

  const cardNumberRef = useRef(null)
  const [cardNumberValue, setCardNumberValue] = useState("")
  const cardExpRef = useRef(null)
  const cardCVVRef = useRef(null)
  const [cardExpValue, setCardExpValue] = useState("")

  function handleCardNumberInput(ref) {
    dispatch({
      type: 'cardNumber',
      cardNumber: ref.current.value
    })
    // const value = cardNumberRef.current.value.replaceAll(" ", "")
    // console.log(value)
    // if (!isNaN(value) && value.length <= 16) {
    //   let newValue = ""
    //   for (let i = 0; i < value.length; i++) {
    //     newValue += value[i]
    //     if ((i+1)%4 == 0 && i < value.length-1) {
    //       newValue += " "
    //     }
    //   }
    //   setCardNumberValue(newValue)
    // }
  }

  function handleCardExpInput(ref) {
    dispatch({
      type: 'cardExp',
      cardExp: ref.current.value
    })
  }

  function handleCardCVVInput(ref) {
    dispatch({
      type: 'cardCVV',
      cardCVV: ref.current.value
    })
  }

  function handleShippingInput(str) {
    dispatch({
      type:'shipping',
      field: str,
      value: refs.shipping[str].current.value
    })
  }

  function handleBillingInput(str) {
    dispatch({
      type:'billing',
      field: str,
      value: refs.billing[str].current.value
    })
  }

  function handleInput(str) {
    let slice = str.split(" ")

    let classList = refs[slice[0]][slice[1]].current.className.split(" ")
    classList = classList.filter((item) => item != "!border-burgundy")
    refs[slice[0]][slice[1]].current.className = classList.join(" ")
    
    dispatch({
      type: slice[0],
      field: slice[1],
      value: refs[slice[0]][slice[1]].current.value
    })
  }

  function handleExpansion(str) {
    dispatch({
      type: 'expanded',
      field: str,
      value:!items.expanded[str]
    })
  }

  function createOrder() {

  }

  function onApprove() {

  }

  async function handleAuthorizePayment() {
    const res = await (await fetch('/api/authorize', {"method": "post", "body": JSON.stringify({
      items
    })})).json()
    console.log(items)
    // console.log(res)
    let slice = res['result'].split(" ")
    if (slice[0] == "missing") {
      if (slice[1] == "cart") {
        // TODO scroll to cart and show it's empty
        console.log("cart is empty")
      } else {
        if (!items.expanded[slice[1]]) {
          handleExpansion(slice[1])
        }
        let classList = refs[slice[1]][slice[2]].current.className.split(" ")
        classList.push("!border-burgundy")
        refs[slice[1]][slice[2]].current.className = classList.join(" ")
        refs[slice[1]][slice[2]].current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } else {
      router.push("/test")
    }
  }

  return (
    <>
      <div className="flex flex-col">
        {/* <div className="relative flex flex-row min-h-[84px] text-amber border-2 border-coolgraylight bg-coolgraymid rounded-lg m-2 items-center overflow-hidden">
          
        </div> */}

        {/* SHIPPING */}
        <Expandable title="Shipping Details" expanded={items.expanded.shipping} handleExpansion={handleExpansion} expansionType="shipping">
          <input ref={refs.shipping["first_name"]} onInput={() => {handleInput("shipping first_name")}} value={items.shipping['first_name']} placeholder="First Name" autoComplete="given-name" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping["last_name"]} onInput={() => {handleInput("shipping last_name")}} value={items.shipping['last_name']} placeholder="Last Name" autoComplete="family-name" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping.email} onInput={() => {handleInput("shipping email")}} value={items.shipping['email']} placeholder="Email" autoComplete="email" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping.address1} onInput={() => {handleInput("shipping address1")}} value={items.shipping['address1']} placeholder="Street Address" autoComplete="address-line1" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline autofill:!text-ochre autofill:!bg-coolgraydark"/>
          <input ref={refs.shipping.address2} onInput={() => {handleInput("shipping address2")}} value={items.shipping['address2']} placeholder="Apartment, suite, unit, etc." autoComplete="address-line2" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping.city} onInput={() => {handleInput("shipping city")}} value={items.shipping['city']} placeholder="City/Town" autoComplete="address-level2" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping.zip} onInput={() => {handleInput("shipping zip")}} value={items.shipping['zip']} placeholder="Postal/ZIP code" autoComplete="postal-code" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping.state} onInput={() => {handleInput("shipping state")}} value={items.shipping['state']} placeholder="State" autoComplete="address-level1" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          <input ref={refs.shipping.country} onInput={() => {handleInput("shipping country")}} value={items.shipping['country']} placeholder="Country" autoComplete="country" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
          {/* <select name="countries">
            <option value="US">United States of America</option>
            <option value="RU">Russia</option>
          </select> */} {/* TODO select country instead of typing */}
        </Expandable>
        

        {/* BILLING DETAILS */}
        <Expandable title="Billing Details" expanded={items.expanded.billing} handleExpansion={handleExpansion} expansionType="billing">
          <div className="m-2">
            <input onClick={handleBillingCheck} type="checkbox" checked={items.billing['same_as_shipping']}/>
            <label className="ml-2">Same as shipping address</label>
          </div>
          {
            !items.billing['same_as_shipping'] ? 
            <>
            <input ref={refs.billing["first_name"]} onInput={() => {handleBillingInput("first_name")}} value={items.billing['first_name']} placeholder="First Name" autoComplete="given-name" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs.billing["last_name"]} onInput={() => {handleBillingInput("last_name")}} value={items.billing['last_name']} placeholder="Last Name" autoComplete="family-name" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs.billing.address1} onInput={() => {handleBillingInput("address1")}} value={items.billing['address1']} placeholder="Street Address" autoComplete="address-line1" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline autofill:!text-ochre autofill:!bg-coolgraydark"/>
            <input ref={refs.billing.address2} onInput={() => {handleBillingInput("address2")}} value={items.billing['address2']} placeholder="Apartment, suite, unit, etc." autoComplete="address-line2" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs.billing.city} onInput={() => {handleBillingInput("city")}} value={items.billing['city']} placeholder="City/Town" autoComplete="address-level2" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs.billing.zip} onInput={() => {handleBillingInput("zip")}} value={items.billing['zip']} placeholder="Postal/ZIP code" autoComplete="postal-code" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs.billing.state} onInput={() => {handleBillingInput("state")}} value={items.billing['state']} placeholder="State" autoComplete="address-level1" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            <input ref={refs.billing.country} onInput={() => {handleBillingInput("country")}} value={items.billing['country']} placeholder="Country" autoComplete="country" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
            </>
            :
            <></>
          }
        </Expandable>



        {/* SHIPPING METHOD */}
        <Expandable title="Shipping Method" expanded={items.expanded["shipping method"]} handleExpansion={handleExpansion} expansionType="shipping method">
          <p className="m-2">USA flat rate: $8.50</p>
        </Expandable>
        


        {/* PAYMENT */}
        <Expandable title="Payment Method" expanded={items.expanded.payment} handleExpansion={handleExpansion} expansionType="payment">
          <div className="m-2 flex flex-col">
            <div className="flex flex-row">
              <input onClick={handleSwitchToCredit} type="radio" id="credit" name="payment-type" checked={items.payment.type=="credit"} />
              <label htmlFor="credit">Credit/Debit Card</label>
            </div>
            <div className="flex flex-row">
              <input onClick={handleSwitchToPaypal} type="radio" id="paypall" name="payment-type" checked={items.payment.type=="paypall"} />
              <label htmlFor="paypall">PayPal</label>
            </div>
            {/* <div className="flex flex-row">
              <input ref={paymentMethods[2]} onClick={() => handleSwitchPaymentMethod(paymentMethods[2])} type="radio" id="google" name="payment-type" checked={paymentMethod=="google"} />
              <label htmlFor="google">Google</label>
            </div> */}
          </div>
          {
            items.payment.type == "credit" ?
            <>
              <input ref={refs.payment["cc-number"]} onInput={() => handleInput("payment cc-number")} value={items.payment['cc-number']} placeholder="XXXX XXXX XXXX XXXX (Card Number)" autoComplete="cc-number" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
              <input ref={refs.payment["cc-exp"]} onInput={() => {handleInput("payment cc-exp")}} value={items.payment['cc-exp']} placeholder="MM/YY (Exp Date)" autoComplete="cc-date" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
              <input ref={refs.payment["cc-cvv"]} onInput={() => {handleInput("payment cc-cvv")}} value={items.payment['cc-cvv']}  placeholder="XXX (CVV/CSC)" autoComplete="cc-csc" className="m-2 w-[500px] border-2 border-coolgraylight focus:border-ochre focus:outline-none rounded-lg bg-coolgraymid p-1 placeholder:text-lightoutline"/>
              <div className="flex text-amber m-2 border-2 rounded-lg border-coolgraylight h-[64px]">
                {
                  items.payment.type == "credit" ?
                  <div className=" h-full relative">
                    <button onClick={handleAuthorizePayment} className="m-2 border-2 border-ochre rounded-lg bg-amber p-2 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">Place Order</button>
                  </div>
                  :
                  <></>
                }
              </div>
            </>
            :
            <div className="relative mx-auto m-2 w-[500px]">
              <span className="absolute w-[125px] h-[25px] bg-lightbg bottom-3.5 left-1/2 -translate-x-1/2 rounded"/>
              <PayPalScriptProvider options={{clientId: "test", components: 'buttons'}}>
                <PayPalButtons style={{layout: "vertical"}} createOrder={createOrder} onApprove={onApprove}/>
              </PayPalScriptProvider>
            </div>
          }
        </Expandable>


        {/* <GooglePayButton
          environment="TEST"
          paymentRequest={paymentRequest}
          onLoadPaymentData={() => {}}
        /> */}
      </div>
    </>
  )
}