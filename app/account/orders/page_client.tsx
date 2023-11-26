'use client'

export default function PageClient({items}) {
  console.log(items)

  if (items['result'] == "success") {
    const itemsJSX = items['items'].map((item) => {
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
  } else {
    return (
      <div className="flex flex-col items-center">
        <p className="m-2 text-2xl font-bold">
          Orders
        </p>
        <p className="mt-[200px]">
          Please login to view the orders.
        </p>
        <a href="/account/login" className="m-4 w-[253px] border-2 border-ochre rounded-lg text-center bg-amber p-1 font-bold text-coolgraydark hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,1)] hover:scale-105 border-2 border-ochre active:scale-[102%] active:shadow-[0px_1px_5px_0px_rgba(0,0,0,1)] disabled:text-coolgraylight disabled:bg-coolgraymid disabled:border-coolgraylight">
          Login
        </a>
      </div>
    )
  }
}