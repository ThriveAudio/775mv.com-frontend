import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Legend from '../_components/static_page_legend'

export default function about() {

  return (
    <Legend section_name={'About'} titles={[
      'How it started',
      'Vision',
      'Process',
      'Shipping'
    ]}
    content={[
      <p>balbla</p>,
      <p>test</p>,
      <p>terwqtfr</p>,
      <p>qwertyuiop</p>
    ]}/>
  )

  // const min_pos = 95
  // const max_pos = 490


  // const sections = [
  //   {'name': 'How it started', 'ref': useRef(null)},
  //   {'name': 'Vision', 'ref': useRef(null)},
  //   {'name': 'Process', 'ref': useRef(null)},
  //   {'name': 'Shipping', 'ref': useRef(null)},
  // ]

  // const [currentSection, setCurrentSection] = useState(0)

  // const parent_ref = useRef(null)


  // function updateLegend() {
  //   for (let i = 0; i < sections.length; i++) {
  //     const y_pos = sections[i].ref.current.getBoundingClientRect().y
  //     const parent_y_pos = parent_ref.current.getBoundingClientRect().y
  //     let calculated_y_pos = y_pos

  //     if (parent_y_pos < min_pos) {
  //       const delta = Math.abs(min_pos - parent_y_pos)
  //       calculated_y_pos = y_pos + delta
  //     }

  //     if (calculated_y_pos <= max_pos && calculated_y_pos >= min_pos-5) {
  //       setCurrentSection(i)
  //     }
  //   }
  // }

  // function scrollTo(ref) {
  //   const y = ref.current.getBoundingClientRect().top-min_pos
  //   parent_ref.current.scrollBy({
  //     top: y,
  //     behavior: 'smooth'
  //   })

  //   // updateLegend()
  // }

  // const legend = sections.map((x, i) => {
  //   if (i == currentSection) {
  //     return (
  //       <div className='border-l-2 pl-2 rounded-r hover:bg-coolgraymid font-bold'>
  //         {x.name}
  //       </div>
  //     )
  //   } else {
  //     return (
  //       <div onClick={() => {scrollTo(x.ref)}} className='border-l-2 pl-2 rounded-r hover:bg-coolgraymid text-ochre cursor-pointer'>
  //         {x.name}
  //       </div>
  //     )
  //   }
  // })

  
  // return (
  //   <>
  //     <div className='w-[200px] -ml-[2px] -mt-[2px] -mb-[2px] border-2 border-coolgraylight rounded-lg'>
  //       <div className='ml-4 mt-4 w-[165px]'>
  //         {legend}
  //       </div>
  //     </div>
  //     <div id='parent' ref={parent_ref} onScroll={updateLegend} className='flex flex-col items-center w-[800px] h-[796px] overflow-y-auto'>
  //       <p className='font-bold text-4xl mt-8'>About</p>
  //       <p ref={sections[0].ref}>How it started</p>
  //       <p className='min-h-[600px] self-start'>test1</p>
  //       <p ref={sections[1].ref}>Vision</p>
  //       <p className='min-h-[600px]'>test2</p>
  //       <p ref={sections[2].ref}>Process</p>
  //       <p className='min-h-[600px]'>test3</p>
  //       <p ref={sections[3].ref}>Shipping</p>
  //       <p className='min-h-[600px]'>test4</p>
  //     </div>
  //   </>
  // )
}
