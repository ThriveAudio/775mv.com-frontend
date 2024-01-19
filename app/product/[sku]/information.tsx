import { useRef } from "react";
import ReactMarkdown from 'react-markdown'

export default function Information({ info, amount, addAmount, subtractAmount, updateAmount, onLostFocus, amountRef, addToCart }: { info: JSON , amount: number, addAmount: any, subtractAmount: any, updateAmount: any, onLostFocus: any, amountRef: any, addToCart: any }) {

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
      <div className='text-wrap mt-4'><ReactMarkdown>{info['description']}</ReactMarkdown></div>

      <div className='absolute bottom-[159px] right-0'>
        <button onClick={subtractAmount} onMouseDown={subtractHold} onMouseUp={subtractUnhold} className='interactable h-[44px] w-[30px] bg-coolgraydark border-l-2 border-t-2 border-b-2 border-coolgraylight rounded-l-lg active:scale-[95%]'>-</button>
        <input onBlur={onLostFocus} onChange={updateAmount} value={amount} ref={amountRef} className='interactable text-center bg-coolgraydark border-2 border-coolgraylight w-[50px] h-[44px] py-3 active:outline-none focus:outline-none'/>
        <button onClick={addAmount} onMouseDown={addHold} onMouseUp={addUnhold} className='interactable h-[44px] w-[30px] bg-coolgraydark border-r-2 border-t-2 border-b-2 border-coolgraylight rounded-r-lg active:scale-[95%]'>+</button>
      </div>

      <button onClick={addToCart} className='interactable absolute bottom-[104px] right-0 p-2 text-coolgraydark font-bold bg-amber rounded-lg hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]'>Add To Cart</button>
    </div>
  )
}