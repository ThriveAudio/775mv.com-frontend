// @ts-nocheck
import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useState } from 'react';
//import { Products, Loading } from './Products';
// import { Categories } from './Categories';
import Page from './page_client';
//const fs = require('fs');
import Products from './page_server'

// function Product({product = {}, image = ""}: {product: Object, image: String}) {
//   if (Object.keys(product).length === 0) {
//     return (
//       <div className='h-[300px] w-[300px] m-3 border rounded-lg shadow-md flex flex-col items-center'>
//         <div className='h-[200px] w-[298px] border-b-2 border-b-gray-400 rounded-t-[7px] bg-gray-300'/>
//         <div className='w-[100px] h-[25px] mt-4 rounded-md bg-gray-300'/>
//         <div className='w-[60px] h-[30px] mt-3 rounded-md flex flex-row overflow-hidden'>
//           <div className='text-xl font-semibold text-gray-400'>$</div>
//           <div className='ml-1 w-full h-[30px] rounded-md bg-gray-300'/>
//         </div>
//       </div>
//     )
//   } else {
//     //et image = fs.readdirSync('./public/'+product['sku'])[0]
//     return (
//       <Link href={"product/"+product['sku']} key={product['_id']} className='group h-[300px] w-[300px] m-3 border rounded-lg shadow-md hover:shadow-xl transition duration-100 flex flex-col items-center'>
//         <div className='border-b-2 border-b-black rounded-t-[7px] overflow-hidden'>
//           <Image src={product['image']} width={300} height={200} alt={product['name']} className='group-hover:scale-110 transition'></Image>
//         </div>
//         <div className='mt-3 text-xl group-hover:underline underline-offset-2 decoration-[1.5px]'>{product['name']}</div>
//         <div className='mt-3 text-xl font-semibold'>${product['price']}</div>
//       </Link>
//     )
//   }
// }

// /// '/'+product['sku']+'/'+fs.readdirSync('./public/'+product['sku'])[0]

// async function Products({products}) {
//   // const res = await fetch('http://127.0.0.1:8000/get-products');

//   // if (!res.ok) {
//   //   return {}
//   // }

//   //let products = await res.json()

//   let image: String = ""
//   const spam = products.map(product => {
//     return <Product product={product}/>
//   })

//   return (
//     <div className='ml-[200px] flex flex-row flex-wrap'>
//       {spam}
//     </div>
//   )
// }

// function Loading() {
//   return (
//     <div className='animate-pulse ml-[200px] flex flex-row flex-wrap'>
//       <Product/>
//       <Product/>
//       <Product/>
//     </div>
//   )
// }

// async function Categories({products}) {

//   // const res = await fetch('http://127.0.0.1:8000/get-products');

//   // if (!res.ok) {
//   //   return {}
//   // }

//   // let products = await res.json()

//   const categories = Array.from(new Set(products.map(product => product['category'])))

//   categories.unshift('All')

//   const buttons = categories.map(category => {
//     return (
//     <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100'>{category}</button>
//     )
//   })

//   return (
//     <div className='fixed w-30 mt-5 border-l flex flex-col items-start'>
//       {buttons}
//       {/* <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100 border-l-gray-500'>All</button>
//       <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100'>Filters</button>
//       <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100'>Services</button> */}
//     </div>
//   )
// }

// export default async function products() {

//   const res = await fetch('http://127.0.0.1:8000/get-products');

//   if (!res.ok) {
//     return {}
//   }

//   const jsonRes = await res.json()

//   const categories = Array.from(new Set(jsonRes.map(product => product['category'])))
//   categories.unshift('All')

//   const products = jsonRes.map(product => {
//     product['image'] = '/'+product['sku']+'/'+fs.readdirSync('./public/'+product['sku'])[0]
//     return product
//   })

//   return (
//     <>
//       {/* <Suspense fallback={<p>loading</p>}>
//         <Categories products={products}/>
//       </Suspense>
//       <Suspense fallback={<Loading/>}>
//         <Products products={listProducts}/>
//       </Suspense> */}
//       <Page categories={categories} products={products}/>
//     </>
//   )
// }

function SampleProduct() {
  return (
    <div className='group h-[300px] w-[300px] m-3 border border-lightoutline dark:border-coolgraylight dark:bg-coolgraydark rounded-lg shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,1)] flex flex-col items-center dark:text-white'>
      <div className='w-[300px] h-[200px] border-b-2 border-b-lightoutline dark:border-b-ochre rounded-t-[7px] overflow-hidden'/>
      <div className='mt-3 w-[100px] h-[25px] bg-amber rounded group-hover:underline underline-offset-2 decoration-[1.5px]'/>
      <div className='mt-4 flex flex-row items-center'>
        <div className='text-xl font-semibold'>$</div>
        <div className='ml-1 w-[40px] h-[25px] rounded bg-white'/>
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className='animate-pulse flex flex-row flex-wrap justify-center'>
      <SampleProduct/>
      <SampleProduct/>
      <SampleProduct/>
    </div>
  )
}


export default function products() {
  return (
    <Suspense fallback={<Loading/>}>
      <Products/>
    </Suspense>
  )
}