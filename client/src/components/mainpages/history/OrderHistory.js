import React, { useState, useContext, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'


function OrderHistory() {
    console.log('re-render')
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token


    const [testUser, setTestUser] = useState([])


    useEffect(() => {
        console.log('useEffect')
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get('/api/payment', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)

                } else {

                    const res = await axios.get('/user/history', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                    console.log('set history')

                }
            }
            getHistory()
        }
    }, [token, isAdmin, setHistory])

    const searchUserHistory = async e => {
        e.preventDefault()
        try {
            await axios.get(`/api/payment/${testUser}`, {
                headers: { Authorization: token }
            })

            // localStorage.setItem('firstLogin', true)

            // window.location.href = "/";
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    return (
        <div className="history-page">
            <h2>History</h2>

            <h4>You have {history.length} ordered</h4>
            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Date of Purchased</th>
                        <th>Total Price ($)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {

                        // orderDetails.cart.map(item =>(
                        //             <td>$ {item.price * item.quantity}</td>))
                        history.map(items => (
                            <tr key={items._id}>
                                <td>{items.paymentID}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                <td>{items.cart.reduce((acc, item) => {
                                    return acc + parseInt(item.price * item.quantity)
                                }, 0)}</td>
                                <td><Link to={`/history/${items._id}`}>View</Link></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <form onSubmit={searchUserHistory}>
                <input type="text" value={testUser}
                    onChange={e => setTestUser(e.target.value.toLowerCase())} placeholder="Input user name" />
                <button type="submit" >Search</button>
            </form>
        </div>
    )
}

export default OrderHistory
