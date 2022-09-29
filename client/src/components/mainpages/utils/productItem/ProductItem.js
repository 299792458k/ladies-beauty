import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import BtnRender from './BtnRender'

function ProductItem({ product, isAdmin, deleteProduct, handleCheck, setLoading }) {
    const [commentsCount, setCommentsCount] = useState(0);
    const [avgStar, setAvgStar] = useState(0);
    const starsArr = [1, 2, 3, 4, 5];

    const roundStar = (floatStars) => {
        const floor = Math.floor(floatStars);
        return floatStars - floor >= 0.5 ? (floor + 1) : (floor)
    }

    useEffect(() => {
        if (product.comments) {
            setCommentsCount(product.comments.length);
            let totalStars = product.comments.reduce((prev, curr) => {
                return prev + Number(curr.stars);
            }, 0)
            setAvgStar(roundStar(totalStars / commentsCount));
        }
    }, [product.comments, commentsCount])

    return (
        <Link to={`/detail/${product._id}`}>
            <div className="product_card">
                {
                    isAdmin && (<><input type="checkbox" id='produtc_item-checkbox' checked={product.checked}
                        onChange={() => handleCheck(product._id)} />
                        <label htmlFor='produtc_item-checkbox'></label></>)
                }
                <img src={product.images.url} alt="" />
                <div className="product_box">
                    <h2 title={product.title}>{product.title}</h2>
                    <span>${product.price}</span>
                    {/* <p>{product.description}</p> */}
                    <div className={commentsCount > 0 ? 'rating' : 'rating not-rated'}>
                        {
                            starsArr.map((item) => {
                                return avgStar >= item ? <FontAwesomeIcon key={item} className="rating-icon" icon={["fas", "star"]} />
                                    : <FontAwesomeIcon key={item} className="rating-icon" icon={["far", "star"]} />
                            })
                        }
                        <p className='rating-count'>({commentsCount})</p>
                    </div>
                    <div className='sold'>
                        Sold: {product.sold}
                    </div>
                </div>
                <BtnRender
                    product={product}
                    deleteProduct={deleteProduct}
                    setLoading={setLoading}
                />
            </div>
        </Link>
    )
}

export default ProductItem
