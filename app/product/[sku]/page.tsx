'use client'
import { useEffect, useState, useRef } from "react"
import { useAtom } from "jotai"
import { cartAtom } from "@/utils/atoms"
import CartNotif from "./cart_notif"
import BigInformation from "./big_information"
import Information from "./information"
import ImageSection from "./image_section"


export default function Page({ params }: { params: { sku: string } }) {

  const [product, setProduct] = useState({})
  // let imgRefs = []

  useEffect(()=> {
    const fetchProduct = async () => {
      const data = await (
        await fetch(
          'http://127.0.0.1:3000/api/get-product',
          {
            method: "post",
            body: JSON.stringify({'sku': params.sku})
          }
        )
      ).json()

      console.log("DATA", data)
      setProduct(data)
      // imgRefs = product['images'].map(() => useRef(null))
    }

    fetchProduct()
  }, [])

  const [cart, setCart] = useAtom(cartAtom)
  const [imgIndex, setImgIndex] = useState(0)
  const [amount, setAmount] = useState(1)
  const amountRef = useRef(null)
  const [notif, setNotif] = useState(false)
  const imgRefs = ((new Array(20)).fill(0, 0, 19)).map(() => useRef(null))


  if (notif) {
    const timer = setTimeout(() => {
      setNotif(false)
      // clearTimeout(timer)
    }, 2000);
  }

  function previousImg() {
    if (imgIndex > 0) {
      setIndex(imgIndex - 1)
    } else {
      setIndex(product['images'].length - 1)
    }
  }

  function nextImg() {
    if (imgIndex < product['images'].length - 1) {
      setIndex(imgIndex + 1)
    } else {
      setIndex(0)
    }
  }

  function userSetIndex(e) {
    setIndex(Number(e.target.id))
  }

  function setIndex(i) {
    console.log("SETTING NEW INDEX: ", imgRefs)
    switch (i) {
      case 0:
        imgRefs[i].current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
        break;

      case product['images'].length - 1:
        imgRefs[i].current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        break;

      default:
        imgRefs[i].current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        break;
    }
    setImgIndex(i)
  }

  function addAmount() {
    setAmount(Number(amount)+1)
  }

  function subtractAmount() {
    if (amount > 1) {
      setAmount(Number(amount)-1)
    }
  }

  function updateAmount() {
    if (!isNaN(amountRef.current.value) && (Number(amountRef.current.value) > 0 || amountRef.current.value == "")) {
      setAmount(amountRef.current.value)
    }
  }

  function onLostFocus() {
    if (amountRef.current.value == "") {
      setAmount(1)
    }
  }

  async function _addToCart() {
    const res = await (await fetch('/api/add-to-cart', {"method": "post", "body": JSON.stringify({"sku": product['sku'], "amount": Number(amount)})})).json()
    // console.log('server res: ', res)
    setCart(cart+Number(amount))
    setNotif(true)
  }

  console.log(product['sku'])
  if (product['sku'] == undefined) {
    return (
      <></>
    )
  }
  return (
    <div className='relative grid grid-cols-2 grid-rows-[460px_auto]'>
      <ImageSection info={product} prevImg={previousImg} nextImg={nextImg} imgIndex={imgIndex} setIndex={userSetIndex} imgRefs={imgRefs} />
      <Information info={product} amount={amount} addAmount={addAmount} subtractAmount={subtractAmount} updateAmount={updateAmount} onLostFocus={onLostFocus} amountRef={amountRef} addToCart={_addToCart}/>

      <BigInformation desc={product['desc']} specs={product['specs']}/>
      <CartNotif show={notif}/>
    </div>
  )

}