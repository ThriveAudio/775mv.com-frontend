// @ts-nocheck
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

export default function Loading() {
  return (
    <div className='animate-pulse flex flex-row flex-wrap justify-center'>
      <SampleProduct/>
      <SampleProduct/>
    </div>
  )
}