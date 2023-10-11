'use client'
//import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState, CSSProperties, useEffect } from 'react'
import { Url } from 'next/dist/shared/lib/router/router'
import { transform } from 'typescript'
import { useAtom } from 'jotai'
import { cartAtom } from './../utils/atoms'
import cartIcon from './../public/cart.png'
import pfpIcon from './../public/pfp.png'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: '775mv',
//   description: 'Generated by create next app',
// }

function NavBar({children, cartAmount}: {children: React.ReactNode, cartAmount: number}) {
  return (
    <nav className='sticky z-50 top-0 left-0 right-0 shadow border-b-2 bg-coolgraydark border-b-coolgraylight text-amber font-bold'>
      <div className='relative mx-auto w-[1280px] flex flex-row justify-center items-center'>
        {children}
        <Link href={'/account/cart'} className='interactable group absolute right-[31px]'>
          <div className='relative px-[8px] py-[11px]'>
            <Image src={cartIcon} width={20} height={10} alt={"cart icon"}/>
            {cartAmount > 0 ? <span className='absolute bottom-1 right-0 px-1 rounded-xl bg-lightaccentbg text-sm text-coolgraydark'>{cartAmount}</span> : <span/>}
            <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre'/>
          </div>
        </Link>
        <Link href={'/account/data'} className='interactable group absolute right-0'>
          <div className='px-[8px] py-[10.5px]'>
            <Image src={pfpIcon} width={15} height={7} alt={"pfp icon"}/>
            <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre'/>
          </div>
        </Link>
      </div>
    </nav>
  );
}

function NavButton({children, href}: {children: React.ReactNode, href: Url}) {
  return (
    <Link href={href} className='interactable group relative px-2 py-2'>
      {children}
      <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre'></span>
    </Link>
  );
}

function Body({children}: {children: React.ReactNode}) {
  return (
    <div className='min-h-[1000px] grid grid-cols-[auto_1280px_auto]'>
      <div className='col-start-2 col-end-3'>
        {children}
      </div>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <div className='static bottom-0 left-0 right-0 text-amber border-t border-t-ochre'>
      <div className='flex flex-row justify-center p-3'>
        <p>Copyright © {year} 775mv All Rights Reserved.</p>
        <p className='px-2'>|</p>
        <Link href="/terms-and-conditions" className='pr-2 underline'>Term & Conditions</Link>
        <Link href="/privacy-policy" className='underline'>Privacy Policy</Link>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  const [cart, setCart] = useAtom(cartAtom)

  useEffect(() => {
    fetch('/api/cart').then(e => e.json()).then(e => {
      let amount = 0
      for (let i = 0; i < e.length; i++) {
        amount = amount + Number(e[i]['amount'])
      }
      setCart(amount)
    })
  }, [])

  const mouseRef = useRef(null);
  const [mouseState, setMouseState] = useState('translate(0px, 0px)');
  const [mouseOpacity, setMouseOpacity] = useState(1)

  //const mouse = document.getElementById('mouse');
  //console.log(mouse)

  function handleMouseMove(e) {
    //console.log(e.target.closest(".interactable"))
    let scale = ""
    const interactable = e.target.closest(".interactable")
    const interacting = (interactable != null);
    if (interacting) {
      scale = "1.5"
      setMouseOpacity(0.6)
    } else {
      scale = "1"
      setMouseOpacity(1)
    }
    setMouseState('translate('+(e.clientX-10)+'px'+', '+(e.clientY-10)+'px)'+' scale('+scale+')')
  }

  function handleMouseLeave(e) {
    setMouseOpacity(0)
  }

  function handleMouseEnter(e) {
    setMouseOpacity(1)
  }

  const currentRoute = usePathname()
  return (
    <html lang="en" className='min-h-screen' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <body className='bg-lightbg dark:bg-coolgraymid font-hero'>
        <div ref={mouseRef} className='mouse' id='mouse' style={{transform: mouseState, opacity: mouseOpacity}}/>
        <NavBar cartAmount={cart}>
          <NavButton href={'/products'}>Products</NavButton>
          <NavButton href={'/about'}>About</NavButton>
        </NavBar>
        <Body>
          {children}
        </Body>
        <Footer/>
      </body>
    </html>
  )
}
