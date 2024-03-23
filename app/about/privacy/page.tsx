import Legend from "@/app/_components/static_page_legend";

export default function Page() {
  return (
    <Legend section_name={'Privacy'} titles={[
      'One',
      'Two',
      'Three'
    ]} content={[
      <p>Something</p>,
      <p>Something 2</p>,
      <p>Something 3</p>
    ]}/>
  )
}