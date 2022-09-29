import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import addDays from 'date-fns/addDays'
import { formatRelative } from 'date-fns'

import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Stars from '../utils/rating/Stars'


function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [token] = state.token
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart

    const [detailProduct, setDetailProduct] = useState([])
    const [commentsCount, setCommentsCount] = useState(0);
    const [avgStar, setAvgStar] = useState(0);
    const [commentsData, setCommentsData] = useState();

    useEffect(() => {
        if (params.id) {

            products.forEach(product => {
                if (product._id === params.id) setDetailProduct(product)
            })
        }
    }, [params.id, products])

    useEffect(() => {
        if (detailProduct.comments) {
            setCommentsCount(detailProduct.comments.length);
            let totalStars = detailProduct.comments.reduce((prev, curr) => {
                return prev + Number(curr.stars);
            }, 0)
            setAvgStar((Math.floor(totalStars / commentsCount * 10)) / 10);
        }
    }, [detailProduct.comments, commentsCount])

    useEffect(() => {
        if (detailProduct.comments) {
            console.log('get data')
            const getCommentsData = async () => {
                if (detailProduct.comments.length > 0) {
                    const res = await axios.get(`/api/comments/${detailProduct._id}`)
                    console.log('res: ' + res.data.commentsData)
                    setCommentsData(res.data.commentsData.reverse())
                }
            }
            getCommentsData();
            // console.log(commentsData)
        }
    }, [detailProduct.comments, token, detailProduct])

    if (detailProduct.length === 0) return null;

    return (
        <>
            <div className="detail">
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                    </div>
                    <span>$ {detailProduct.price}</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    <p>Sold: {detailProduct.sold}</p>
                    <Link to="/cart" className="cart"
                        onClick={() => addCart(detailProduct)}>
                        Buy Now
                    </Link>
                </div>
            </div>
            <div className="detail-rating">
                <h2 className="detail-rating-title">Product Ratings</h2>
                <div className='detail-rating-header'>
                    <div className='detail-rating-header-stars'>
                        {detailProduct.comments.length > 0 ?
                            <>
                                <span style={{ fontSize: '32px', fontWeight: '500' }}>{avgStar}</span> out of 5 ({commentsCount})
                            </> : <span style={{ fontSize: '32px' }}>No ratings</span>
                        }
                    </div>
                    <div className="detail-rating-header-icons">
                        <Stars stars={5} />
                    </div>
                </div>
            </div>
            {commentsData &&
                <div className="detail-rating-comments show">
                    {commentsData.map((item, index) => {
                        return (
                            <div key={index} className="rating-comments-item">
                                <div className="comments-item-left">
                                    <img className='comments-item-avt' src={item.userAvt ? item.userAvt : 'https://www.eduvidya.com/admin/Upload/Schools/637546977339653925_no%20image.png'} alt="none" />
                                </div>
                                <div className="comments-item-right">
                                    <div className='comments-item-username'>
                                        {item.userName}
                                    </div>
                                    <div className="comments-item-stars">
                                        <Stars stars={item.stars} />
                                    </div>
                                    <div className="comments-item-time">
                                        {item.time ? (formatRelative(new Date(item.time), new Date())).toString() : '2022-01-16 19:44'}
                                    </div>
                                    <div className="comments-item-data">
                                        {item.comment}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            <div>
                <h2 style={{ textTransform: 'uppercase', color: '#555' }}>Related products</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailProduct
