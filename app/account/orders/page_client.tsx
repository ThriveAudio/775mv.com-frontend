'use client'

export default function PageClient({items}) {
  console.log(items)

  const itemsJSX = items.map((item) => {
    return (
      <a href={"/account/orders/"+item['db_id']} className="m-2 p-2 w-[500px] h-[50px] flex flex-row items-center justify-between border-2 border-coolgraylight rounded-lg bg-coolgraymid transition-all hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-[102%] shadow-[0px_1px_5px_0px_rgba(0,0,0,1)]">
        <p>
          Order #{item['id']}
        </p>
        <p>
          Status: {item['order_status']}
        </p>
        <p>
          {item['items']} items
        </p>
        <p>
          Total: ${item['total']}
        </p>
      </a>
    )
  })

  // TODO add shipping price

  return (
    <>
      <div className="m-2 flex flex-col items-center text-2xl font-bold">
        Orders
      </div>
      <div className="m-2 flex flex-col items-center">
        {itemsJSX}
      </div>
    </>
  )
}