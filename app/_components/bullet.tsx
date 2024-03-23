// @ts-nocheck
export default function Bullet({children}) {
  return (
    <div className="flex flex-row items-center">
      <span className="bg-amber w-[5px] h-[5px] rounded-full mr-2"/>
      {children}
    </div>
  )
}