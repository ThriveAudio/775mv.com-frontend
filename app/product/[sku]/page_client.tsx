'use client'
import Image from 'next/image'
import { Dispatch, FormEventHandler, MouseEventHandler, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import LeftChevron from './../../../public/left_chevron.png'
import RightChevron from './../../../public/right_chevron.png'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import ReactMarkdown from 'react-markdown'
import { useAtom } from 'jotai'
import { cartAtom } from './../../../utils/atoms'


function MainImage({ source, name, previousImg, nextImg }: { source: StaticImport, name: string, previousImg: MouseEventHandler<HTMLDivElement>, nextImg: MouseEventHandler<HTMLDivElement> }) {
  return (
    <div onClick={() => { console.log("clicked") }} className="group relative max-w-fit text-white rounded-lg overflow-hidden border-2 border-coolgraylight">
      <Image src={source} width={500} height={300} alt={name} />
      <div onClick={previousImg} className='interactable absolute left-3 top-[110px] w-[60px] h-[60px] bg-white/[.15] rounded-lg hover:bg-white/[.25] active:scale-[90%] opacity-0 group-hover:opacity-100 transition'>
        <Image src={LeftChevron} width={20} height={20} alt="left chevron" className='absolute left-[19px] top-[11.5px] select-none' />
        {/* <div className='absolute left-[26px] top-[27px] w-[2px] h-[20px] rounded origin-center -rotate-45 bg-white'/>
        <div className='absolute left-[26px] top-[14px] w-[2px] h-[20px] rounded origin-center rotate-45 bg-white'/> */}
      </div>
      <div onClick={nextImg} className='interactable absolute right-3 top-[110px] w-[60px] h-[60px] bg-white/[.15] rounded-lg hover:bg-white/[.25] active:scale-[90%] opacity-0 group-hover:opacity-100 transition'>
        <Image src={RightChevron} width={20} height={20} alt="left chevron" className='absolute left-[22px] top-[11.5px] select-none' />
      </div>
    </div>
  )
}

function Images({ images, index, name, setIndex, refs }: { images: Array<string>, index: Number, name: string, setIndex: MouseEventHandler<HTMLImageElement>, refs: Array<MutableRefObject<any>> }) {
  return images.map((image, i) => {
    if (index == i) {
      return <Image src={image} width={120} height={68} alt={name} className='w-[120px] mx-2 rounded' />
    } else {
      return <Image onClick={setIndex} ref={refs[i]} id={i.toString()} src={image} width={120} height={68} alt={name} className='interactable opacity-[35%] mx-2 rounded' />
    }
  })
}


function ImageRow(props: { images: Array<string>, index: Number, name: string, setIndex: MouseEventHandler<HTMLImageElement>, refs: Array<MutableRefObject<any>> }) {
  return (
    <div className='mt-7 py-2 w-[504px] bg-coolgraydark overflow-x-auto scrollbar-hide flex flex-row border-2 border-coolgraylight rounded-lg'>
      <Images {...props} />
    </div>
  )
}

function Information({ info, amount, addAmount, subtractAmount, updateAmount, onLostFocus, amountRef, addToCart }: { info: JSON , amount: number, addAmount: any, subtractAmount: any, updateAmount: any, onLostFocus: any, amountRef: any, addToCart: any }) {

  const holding = useRef('none')
  const updateFuncVar = useRef(setTimeout(updateOnHeld, 200))

  function updateOnHeld() {
    switch (holding.current) {
      case "add":
        addAmount()
        break;

      case "subtract":
        subtractAmount()
        break;
    
      default:
        break;
    }
  }

  function addHold() {
    //setTimeout(() => holding.current = "add", 500)
  }

  function addUnhold() {

  }

  function subtractHold() {

  }

  function subtractUnhold() {

  }

  return (
    <div className='justify-self-start ml-4 mt-[19px] col-start-2 h-[412px] w-[500px] text-amber relative flex flex-col'>
      <div className='self-left font-bold text-4xl'>{info['name']}</div>
      <p className='text-wrap mt-4'>{info['description']}</p>

      <div className='absolute bottom-[174px] right-0'>
        <button onClick={subtractAmount} onMouseDown={subtractHold} onMouseUp={subtractUnhold} className='interactable h-[44px] w-[30px] bg-coolgraydark border-l-2 border-t-2 border-b-2 border-coolgraylight rounded-l-lg active:scale-[95%]'>-</button>
        <input onBlur={onLostFocus} onChange={updateAmount} value={amount} ref={amountRef} className='interactable text-center bg-coolgraydark border-2 border-coolgraylight w-[50px] h-[44px] py-3 active:outline-none focus:outline-none'/>
        <button onClick={addAmount} onMouseDown={addHold} onMouseUp={addUnhold} className='interactable h-[44px] w-[30px] bg-coolgraydark border-r-2 border-t-2 border-b-2 border-coolgraylight rounded-r-lg active:scale-[95%]'>+</button>
      </div>

      <button onClick={addToCart} className='interactable absolute bottom-[119px] right-0 p-2 text-coolgraydark font-bold bg-amber rounded-lg hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]'>Add To Cart</button>
    </div>
  )
}

function ImageSection({ info, prevImg, nextImg, imgIndex, setIndex, imgRefs }) {
  return (
    <div className='w-fit justify-self-end col-start-1 col-end-2 mt-7 mr-4'>
      <MainImage source={info['images'][imgIndex]} name={info['name']} previousImg={prevImg} nextImg={nextImg} />
      <ImageRow images={info['images']} index={imgIndex} name={info['name']} setIndex={setIndex} refs={imgRefs} />
    </div>
  )
}

function NavBar({currentInfo, setCurrentInfo}) {

  const spanClass = 'absolute w-full h-[2px] left-0 bottom-0 -mb-[2px] '

  let descButton = ""
  let specsButton = ""
  if (currentInfo == "desc") {
    descButton = "bg-ochre"
    specsButton = ""
  } else if (currentInfo == "specs") {
    specsButton = "bg-ochre"
    descButton = ""
  }

  return (
    <div className='w-full h-9 bg-coolgraydark border-b-2 border-coolgraylight flex justify-between px-[410px]'>
      <button id="desc" onClick={setCurrentInfo} className='group relative interactable px-2 hover:bg-coolgraymid'>
        Description
        <span className={spanClass+descButton}/>
      </button>
      <button id="specs" onClick={setCurrentInfo} className='group relative interactable px-2 hover:bg-coolgraymid'>
        Specs
        <span className={spanClass+specsButton}/>
      </button>
    </div>
  )
}

function BigInformation({desc, specs}) {

  const [currentInfo, setCurrentInfo] = useState('desc')
  const [text, setText] = useState(desc)

  function updateCurrentInfo(e) {
    setCurrentInfo(e.target.id)
    if (e.target.id == "desc") {
      setText(desc)
    } else if (e.target.id == "specs") {
      setText(specs)
    }
  }

  return (
    <div className='justify-self-center col-start-1 col-end-3 row-start-2 mt-7 mb-7 w-[1038px] border-2 border-coolgraylight rounded-lg overflow-hidden text-amber'>
      <NavBar currentInfo={currentInfo} setCurrentInfo={updateCurrentInfo}/>
      <div className='w-full p-5'>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  )
}

// function CartNotif({show}: {show: Boolean}) {
//   if (show) {
//     return (
//       <div className='fixed bottom-10 left-1/2 -translate-x-1/2 p-[8px] bg-amber border-2 border-ochre rounded-lg w-[300px] h-[70px] flex justify-center items-center text-coolgraydark font-bold'>
//         Added To Cart!
//       </div>
//     )
//   } else {
//     return (
//       <div className='fixed -bottom-10 left-1/2 -translate-x-1/2 p-[8px] bg-amber border-2 border-ochre rounded-lg w-[300px] h-[70px] flex justify-center items-center text-coolgraydark font-bold'>
//         Added To Cart!
//       </div>
//     )
//   }
// }


export default function ProductPage({ info }: { info: JSON }) { // TODO procedurally load higher quality images

  const [cart, setCart] = useAtom(cartAtom)

  const [imgIndex, setImgIndex] = useState(0)
  const imgRefs = info['images'].map(() => useRef(null))

  const [amount, setAmount] = useState(1)
  const amountRef = useRef(null)

  // const [notif, setNotif] = useState(false)


  function previousImg() {
    if (imgIndex > 0) {
      setIndex(imgIndex - 1)
    } else {
      setIndex(info['images'].length - 1)
    }
  }

  function nextImg() {
    if (imgIndex < info['images'].length - 1) {
      setIndex(imgIndex + 1)
    } else {
      setIndex(0)
    }
  }

  function userSetIndex(e) {
    setIndex(Number(e.target.id))
  }

  function setIndex(i) {
    switch (i) {
      case 0:
        imgRefs[i].current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
        break;

      case info['images'].length - 1:
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
    const res = await (await fetch('/api/add-to-cart', {"method": "post", "body": JSON.stringify({"sku": info['sku'], "amount": amount})})).json()
    console.log('server res: ', res)
    setCart(cart+amount)
    // setNotif(true)
  }

  // useEffect(() => {
  //   if (notif) {
  //     const timer = setTimeout(() => {
  //       setNotif(false)
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);
  // TODO fix cart counter BS
  return (
    <div className='relative grid grid-cols-2 grid-rows-[431px_auto]'>
      <ImageSection info={info} prevImg={previousImg} nextImg={nextImg} imgIndex={imgIndex} setIndex={userSetIndex} imgRefs={imgRefs} />
      <Information info={info} amount={amount} addAmount={addAmount} subtractAmount={subtractAmount} updateAmount={updateAmount} onLostFocus={onLostFocus} amountRef={amountRef} addToCart={_addToCart}/>

      <BigInformation desc={info['desc']} specs={info['specs']}/>
      {/* <CartNotif show={notif}/> */}
    </div>
  )
}

{/* <MainImage source={info['images'][imgIndex]} name={info['name']} previousImg={previousImg} nextImg={nextImg}/>
        <ImageRow images={info['images']} index={imgIndex} name={info['name']} setIndex={userSetIndex} refs={imgRefs}/> */}