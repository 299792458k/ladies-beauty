import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { GlobalState } from '../../../GlobalState'
import Modal from '../utils/modal/Modal'
function OrderDetails() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetails, setOrderDetails] = useState([])
    const params = useParams()

    const [showModal, setShowModal] = useState(false);
    const [ratingItem, setRatingItem] = useState({});
    const closeModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        if (params.id) {
            history.forEach(item => {
                if (item._id === params.id) setOrderDetails(item)
            })
        }
    }, [params.id, history])


    if (orderDetails.length === 0) return null;

    return (
        <>
            <div className="history-page">


                <table style={{ margin: "30px 0px" }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderDetails.cart.map(item => (
                                <tr key={item._id}>
                                    <td><img src={item.images.url} alt="" /></td>
                                    <td>{item.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>$ {item.price * item.quantity}</td>
                                    <td>
                                        <button
                                            className="rate-product"
                                            onClick={
                                                () => {
                                                    setRatingItem(item)
                                                    setShowModal(true)
                                                }
                                            }
                                        >
                                            Rate us
                                        </button>
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>
                </table>
            </div>
            {showModal ?
                <Modal
                    show={showModal}
                    handleClose={closeModal}
                    item={ratingItem}
                >

                </Modal>
                :
                null
            }
        </>
    )
}

export default OrderDetails
