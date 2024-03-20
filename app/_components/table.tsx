export function Table({children, rows, cols}) {
  return (
    <div className={"grid grid-rows-"+rows+" grid-cols-"+cols+" w-fit"}>{children}</div>
  )
}