import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

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

export default function BigInformation({desc, specs}) {

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
