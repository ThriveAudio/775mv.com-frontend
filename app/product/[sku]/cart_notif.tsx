export default function CartNotif({show}: {show: Boolean}) {
  if (show) {
    console.log("showing notif") //  shadow-[0_0px_30px_-15px_rgba(255,160,25,1),inset_0_0px_25px_-15px_rgba(255,160,25,1)]
    return (
      <div className='transition-all ease-out duration-300 fixed bottom-20 left-1/2 -translate-x-1/2 p-[8px] bg-coolgraydark/[.85] border-[1px] border-amber rounded-lg w-[300px] h-[70px] flex justify-center items-center text-amber font-bold'>
        Added To Cart!
      </div>
    )
  } else {
    console.log("hiding notif")
    return (
      <div className='transition-all ease-in duration-300 fixed -bottom-20 left-1/2 -translate-x-1/2 p-[8px] bg-coolgraydark/[.85] border-[1px] border-amber rounded-lg w-[300px] h-[70px] flex justify-center items-center text-amber font-bold'>
        Added To Cart!
      </div>
    )
  }
}