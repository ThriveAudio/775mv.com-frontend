// @ts-nocheck
export default function Categories({categories, current, onclick}) {

  const buttons = categories.map(category => {
    if (current == category) {
      return <button onClick={onclick} id={category} className='interactable w-[110px] pl-3 -ml-[1px] text-left font-bold dark:text-amber border-l-2 hover:bg-gray-100 dark:hover:bg-coolgraydark border-l-gray-500 dark:border-l-amber rounded-r-md'>{category}</button>
    } else {
      return <button onClick={onclick} id={category} className='interactable w-[110px] pl-3 -ml-[1px] text-left dark:text-ochre border-l-2 dark:border-l-ochre hover:bg-gray-100 dark:hover:bg-coolgraydark rounded-r-md'>{category}</button>
    }
  })

  return (
    <div className='fixed w-30 mt-5 flex flex-col items-start'>
      {buttons}
    </div>
  )
}