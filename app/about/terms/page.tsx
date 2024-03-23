import Legend from "@/app/_components/static_page_legend";

export default function Page() {
  return (
    <Legend section_name={'Terms & Conditions'} titles={[
      'Section 1',
      'Section 2',
      'Section 3'
    ]} content={[
      <p>something</p>,
      <p>something else</p>,
      <p>a third thing</p>
    ]}/>
  )
}