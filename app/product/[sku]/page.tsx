import Product from './page_server'

export default function Page({ params }: { params: { sku: string } }) {
  console.log(params.sku)
  return <Product sku={params.sku}/>
}