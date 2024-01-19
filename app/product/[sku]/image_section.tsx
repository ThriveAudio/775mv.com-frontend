import Image from 'next/image'
import { MouseEventHandler, MutableRefObject } from 'react'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import LeftChevron from './../../../public/left_chevron.png'
import RightChevron from './../../../public/right_chevron.png'

function MainImage({ source, name, previousImg, nextImg }: { source: StaticImport, name: string, previousImg: MouseEventHandler<HTMLDivElement>, nextImg: MouseEventHandler<HTMLDivElement> }) {
  return (
    <div onClick={() => { console.log("clicked") }} className="group relative max-w-fit text-white rounded-lg overflow-hidden border-2 border-coolgraylight">
      <Image src={source} width={500} height={300} alt={name} className='w-[500px] h-[300px]' />
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

export default function ImageSection({ info, prevImg, nextImg, imgIndex, setIndex, imgRefs }) {
  return (
    <div className='w-fit justify-self-end col-start-1 col-end-2 mt-7 mr-4'>
      <MainImage source={info['images'][imgIndex]} name={info['name']} previousImg={prevImg} nextImg={nextImg} />
      <ImageRow images={info['images']} index={imgIndex} name={info['name']} setIndex={setIndex} refs={imgRefs} />
    </div>
  )
}