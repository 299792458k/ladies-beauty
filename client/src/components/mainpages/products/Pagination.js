import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
var activeItem = 1;
function Pagination({ allProducts }) {
    console.log('re-render')
    const state = useContext(GlobalState)
    const [page, setPage] = state.productsAPI.page

    // handle Pagination
    const pageCount = Math.ceil(allProducts / 6)
    const arr = []
    for (let i = 1; i <= pageCount; i++) {
        arr.push(i);
    }
    const handleOnclick = (e) => {
        document.getElementById(activeItem).classList.remove('active')
        activeItem = e.target.id
        document.getElementById(activeItem).classList.add('active')
        setPage(Number(activeItem))
    }
    return (
        // <div className="load_more">
        //     {
        //         result < page * 3 ? ""
        //         : <button onClick={() => setPage(page+1)}>Load more</button>
        //     }
        // </div>
        <div className="pagination">
            {
                arr.map(item => {
                    return <button key={item} id={item} className={item === page ? 'active' : ''} onClick={(e) => handleOnclick(e)}>{item}</button>
                })
            }
        </div>
    )
}

export default Pagination
