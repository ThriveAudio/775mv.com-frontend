// @ts-nocheck
'use client'
import { useRef, useState } from "react"

export default function Legend({section_name, titles, content}) {
  const min_pos = 95
  const max_pos = 490


  const sections = titles.map((x) => {
    return {'name': x, 'ref': useRef(null)}
  })

  // const sections = [
  //   {'name': 'How it started', 'ref': useRef(null)},
  //   {'name': 'Vision', 'ref': useRef(null)},
  //   {'name': 'Process', 'ref': useRef(null)},
  //   {'name': 'Shipping', 'ref': useRef(null)},
  // ]

  const [currentSection, setCurrentSection] = useState(0)

  const parent_ref = useRef(null)


  function updateLegend() {
    for (let i = 0; i < sections.length; i++) {
      const y_pos = sections[i].ref.current.getBoundingClientRect().y
      const parent_y_pos = parent_ref.current.getBoundingClientRect().y
      let calculated_y_pos = y_pos

      if (parent_y_pos < min_pos) {
        const delta = Math.abs(min_pos - parent_y_pos)
        calculated_y_pos = y_pos + delta
      }

      if (calculated_y_pos <= max_pos && calculated_y_pos >= min_pos-5) {
        setCurrentSection(i)
      }
    }
  }

  function scrollTo(ref) {
    const y = ref.current.getBoundingClientRect().top-min_pos
    parent_ref.current.scrollBy({
      top: y,
      behavior: 'smooth'
    })

    // updateLegend()
  }

  const legend = sections.map((x, i) => {
    if (i == currentSection) {
      return (
        <div className='border-l-2 pl-2 rounded-r hover:bg-coolgraymid font-bold'>
          {x.name}
        </div>
      )
    } else {
      return (
        <div onClick={() => {scrollTo(x.ref)}} className='border-l-2 pl-2 rounded-r hover:bg-coolgraymid text-ochre cursor-pointer'>
          {x.name}
        </div>
      )
    }
  })


  const rendered_content = content.map((x, i) => {
    return (
      <>
        <p ref={sections[i].ref}>{sections[i].name}</p>
        <div className='min-h-[600px] self-start'>{x}</div>
      </>
    )
  })

  
  return (
    <>
      <div className='w-[200px] -ml-[2px] -mt-[2px] -mb-[2px] border-2 border-coolgraylight rounded-lg'>
        <div className='ml-4 mt-4 w-[165px]'>
          {legend}
        </div>
      </div>
      <div id='parent' ref={parent_ref} onScroll={updateLegend} className='flex flex-col items-center w-[800px] h-[796px] overflow-y-auto'>
        <p className='font-bold text-4xl mt-8'>{section_name}</p>
        {rendered_content}
      </div>
    </>
  )
}