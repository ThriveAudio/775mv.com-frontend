'use client'
import Image from 'next/image'

function getDateTime(timestamp: number): string {
  const date = new Date(timestamp*1000)
  return date.getUTCDate().toString() +"/"+
    date.getUTCMonth().toString() +"/"+
    date.getUTCFullYear().toString() +" "+
    date.getUTCHours().toString() +":"+
    date.getUTCMinutes().toString() +":"+
    date.getUTCSeconds().toString() + " UTC"
}

export default function PageOrder({order}: {order: JSON}) {
  let mainMsg = ""
  if (order['order_status'] == "processing") {
    mainMsg = "Our team is now working on it."
  }

  console.log(order['items']['newItems'])

  const items = order['items']['newItems'].map(item => {
    return (
      <div className="m-2 h-[66px] flex flex-row items-center justify-between border-2 border-coolgraylight rounded-lg overflow-hidden">
        <Image src={item['image']} width={100} height={66} alt={item['sku']}/>
        <div>${item['price']}</div>
        <div>x{item['amount']}</div>
        <div className='m-2 font-bold'>${item['price']*item['amount']}</div>
      </div>
    )
  })

  let total = 0

  order['items']['newItems'].forEach(item => {
    total += item['price']*item['amount']
  });

  return <>
    <div className="m-2 flex flex-col items-center text-2xl font-bold">
      <div>Thank you for your order!</div>
      <div>{mainMsg}</div>
    </div>

    <div className='m-2 flex flex-col items-center'>
      An order receipt has been sent to your email address.
    </div>

    <div className='m-2 flex flex-col items-center'>
      <div className="relative w-[300px] h-[350px] border-2 border-coolgraylight rounded-lg">
        <div className='h-[312px] overflow-y-auto'>
          {items}
        </div>
        <div className='absolute -bottom-[2px] -left-[2px] w-[300px] border-2 border-coolgraylight rounded-lg'>
          <div className='flex flex-col'>
            <div className='flex flex-row justify-end'>
              <div className='mr-4 mt-1 mb-1'>
                total: <span className='font-bold'>${total}</span>
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <span className='w-[270px] h-[1px] bg-coolgraylight'/>
            </div>
            <div className='mt-2 mb-2 ml-4 mr-4 text-xs'>
              Your card won't be charged until your entire order is shipped.
            </div>
          </div>
        </div>
      </div>
    </div>
    <button className='absolute m-2 bottom-0 right-0 border-2 border-coolgraylight rounded-lg px-2 text-lightoutline transition-all hover:bg-burgundy'>Cancel Order</button>
  </>
}