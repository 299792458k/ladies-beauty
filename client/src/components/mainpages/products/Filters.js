import React, { useContext, useEffect, useState } from 'react'

import useDebounce from '../../../utils/hooks/useDebounce'
import { GlobalState } from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    // only setSearch to call API when debounceSearch changes
    const [search, setSearch] = state.productsAPI.search
    // (local state)
    const [localSearch, setLocalSearch] = useState('')

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    const debounceSearch = useDebounce(localSearch);
    console.log(debounceSearch)
    // debounce search to call API
    useEffect(() => {
        setSearch(debounceSearch)
    }, [debounceSearch, setSearch])


    // 2 ways to handle debounce
    // Closure or useDebounce
    // const debounce = (func, timeout = 300) => {
    //     let timer
    //     return () => {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => {
    //             func()
    //         }, timeout)
    //     }
    // }
    // const handleInput = () => {
    //     console.log('input')
    // }
    // const handleChange = debounce(handleInput)
    return (
        <div className="filter_menu">
            <div className="row">
                <span>Filters: </span>
                <select name="category" value={category} onChange={handleCategory} >
                    <option value=''>All Products</option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" placeholder="Enter your search!" value={localSearch}
                onChange={e => setLocalSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                <span>Sort By: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Newest</option>
                    <option value='sort=oldest'>Oldest</option>
                    <option value='sort=-sold'>Best sales</option>
                    <option value='sort=-price'>Price: High-Low</option>
                    <option value='sort=price'>Price: Low-High</option>
                </select>
            </div>
        </div>
    )
}

export default Filters
