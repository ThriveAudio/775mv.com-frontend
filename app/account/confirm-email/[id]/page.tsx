import PageServer from './page_server'

export default function Page({ params }: { params: { id: string } }) {
  return (<PageServer id={params.id}/>)
}