import PageOrderServer from './page_server'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PageOrderServer id={params.id}/>
  )
}