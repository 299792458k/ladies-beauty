import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Loading from '../utils/loading/Loading'
import Filters from './Filters'
import Pagination from './Pagination'


function Products() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const [allProducts] = state.productsAPI.allProducts

    const handleCheck = (id) => {
        var count = 0
        products.forEach(product => {
            if (product._id === id) { product.checked = !product.checked }
            if (product.checked) count = count + 1;
        })
        if (count === products.length) setIsCheck(true)
        else setIsCheck(false);
        setProducts([...products])
    }

    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', { public_id }, {
                headers: { Authorization: token }
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token }
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    const checkAll = () => {
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () => {
        products.forEach(product => {
            if (product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }

    if (loading) return <div><Loading /></div>
    return (
        <>
            <Filters />

            {
                isAdmin &&
                <div className="delete-all">
                    <span>Select all</span>
                    <input type="checkbox" id="checkboxAll" checked={isCheck} onChange={checkAll} />
                    <label htmlFor="checkboxAll"></label>
                    <button onClick={deleteAll} id="deleteAllBtn">Delete ALL</button>
                </div>
            }

            <div className="products">
                {
                    products.map(product => {
                        return <ProductItem
                            key={product._id}
                            product={product}
                            isAdmin={isAdmin}
                            deleteProduct={deleteProduct}
                            handleCheck={handleCheck}
                            setLoading={setLoading}
                        />
                    })
                }
            </div>

            <Pagination allProducts={allProducts} />
            {products.length === 0 && <Loading />}
        </>
    )
}

export default Products
