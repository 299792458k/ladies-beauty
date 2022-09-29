import {useState, useEffect} from 'react'
import axios from 'axios'


function ProductsAPI() {
    const [products, setProducts] = useState([])
    // callback to update history (tranSuccess change -> setCallback -> re-render)
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)

    const [allProducts, setAllProducts] = useState(0)
    useEffect(() =>{
        const getProducts = async () => {
            const res = await axios.get(`/api/products?page=${page}&${category}&${sort}&title[regex]=${search}`)
            setProducts(res.data.products)
            console.log("set products")
            setAllProducts(res.data.allProducts)
            console.log("set allProducts")
            setResult(res.data.result)
            console.log("set result")

        }
        getProducts()
    },[callback, category, sort, search, page])
    
    return {
        products: [products, setProducts],
        callback: [callback, setCallback], 
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult],
        allProducts: [allProducts, setAllProducts]
    }
}

export default ProductsAPI
