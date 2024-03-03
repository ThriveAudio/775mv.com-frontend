// @ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import Products from './products'
import Categories from './categories'
import Loading from './products_loading'

export default function Page() {
  const [category, setCategory] = useState('All')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(()=> {
    const fetchProducts = async () => {
      const data = await (
        await fetch(
          '/api/get-products'
        )
      ).json()

      console.log("DATA", data)
      setProducts(data)
      
      let temp_categories = Array.from(new Set(data.map(product => product['category'])))
      temp_categories.unshift('All')
      setCategories(temp_categories)
    }

    fetchProducts()
  }, [])

  function changeCategory(e) {
    setCategory(e.target.id)
    
    if (e.target.id == "All") {
      setProducts(products)
    } else {
      setProducts(products.filter(product => product['category'] == e.target.id))
    }
  }


  if (products.length == 0) {
    return (
      <Loading/>
    )
  }
  return (
    <>
      <Categories categories={categories} current={category} onclick={changeCategory}/>
      <Products products={products}/>
    </>
  )
}