import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import { useContext, useState } from 'react'
import { toast } from 'react-toastify';


import { GlobalState } from '../../../../GlobalState';
import './Modal.css'

function Modal({ show, handleClose, children, item }) {
    const state = useContext(GlobalState);
    const [token] = state.token
    const showHideModal = show ? 'modal show' : 'modal hide';
    const starArr = [
        { star: 1, quality: 'terrible' },
        { star: 2, quality: 'poor' },
        { star: 3, quality: 'fair' },
        { star: 4, quality: 'good' },
        { star: 5, quality: 'awesome' },
    ];

    const [stars, setStars] = useState(5);
    const [editing, setEditing] = useState(false);
    const [textLength, setTextLength] = useState(0);
    const [comment, setComment] = useState('');

    const handleRate = (e) => {
        console.log(e.target.closest('svg').getAttribute('value'));
        setStars(e.target.closest('svg').getAttribute('value'))
    }

    const handleChangeComment = (e) => {
        setTextLength(e.target.value.length)
    }

    const handleSaveRating = async () => {
        if (!comment) {
            return toast.error('Please leave a comment')
        }
        const res = await axios.post('/user/product-rating', {
            data: {
                'product_id': item._id,
                'stars': stars,
                'comment': comment,
            }
        }, { headers: { Authorization: token } })
        if (res.data.warning) {
            return toast.warning(res.data.warning)
        }
        toast.success(res.data.msg)
        handleClose();
    }
    return (
        <div className={showHideModal}>
            <div className="modal-container">
                <div className="modal-header">
                    Rate us
                </div>
                <div className="modal-main">
                    <div className="modal-product">
                        <img className="modal-product-img" src={item.images.url} alt="img"></img>
                        <div className="modal-product-info">
                            <div className="modal-product-name">{item.title}</div>
                            <span className="modal-product-description">Description: {item.description}</span>
                        </div>
                    </div>
                    <div className="modal-rating">
                        <span style={{ marginRight: '32px' }}>Product Quality: </span>
                        {starArr.map((item) =>
                            <FontAwesomeIcon className="rating-icon" key={item.star} value={item.star}
                                icon={item.star > stars ? ["far", "star"] : ["fas", "star"]}
                                onClick={handleRate}
                            />
                        )}
                        <span className="product-quality">{starArr[stars - 1].quality}</span>
                    </div>
                    <div className="modal-comment-wrapper">
                        <div className="modal-comment-container">
                            <div className="comment-header">
                                <span className='comment-header-title'>Leave a comment</span>
                            </div>
                            <div className="comment-body">
                                <textarea name="" id="" cols="30" rows="10"
                                    maxLength={400}
                                    minLength={50}
                                    onFocus={() => setEditing(true)}
                                    onBlur={(e) => {
                                        setEditing(false)
                                        setComment(e.target.value)
                                    }}
                                    onChange={handleChangeComment}
                                    placeholder="Share us what you like about this product!"
                                >
                                </textarea>
                                <div className='textarea-maxlength'>
                                    {editing ? `${textLength}/400` : 'Max 400 characters'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button
                        className='modal-close'
                        onClick={handleClose}
                    >CLose</button>
                    <button
                        className='modal-save primary'
                        onClick={handleSaveRating}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;