import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HeadlessTippy from '@tippyjs/react/headless'
import 'tippy.js/animations/scale.css';
import axios from 'axios'
import { toast } from 'react-toastify'
import { formatRelative } from 'date-fns'


import './Chat.css'
import { GlobalState } from '../../GlobalState'
import { DownIcon, SendIcon } from '../../assets'
import { useContext, useState, useEffect, useCallback } from 'react'

function Chat() {
    console.log('re-render')
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [socket] = state.socket;
    const [chatPopperInstance, setChatPopperInstance] = useState(null);
    const [userProfile] = state.userAPI.userProfile;
    const userId = userProfile._id;
    const [message, setMessage] = useState();
    const [contacts, setContacts] = useState([]);
    const [selectingContact, setSelectingContact] = useState(null);
    const handleSendMessage = async () => {
        console.log('send msg: ' + message)
        const msg = message;
        if (!msg) return;
        try {
            const time = Date.now();
            const roomId = selectingContact ? selectingContact.getAttribute('roomid') : null;
            // save message to mongodb, return userId 
            const res = await axios.post('/user/sendMessage', { msg, time, roomId }, {
                headers: { Authorization: token }
            })
            socket.emit('sendMessage', { senderId: selectingContact ? userId : res.data.userId, roomId: selectingContact ? selectingContact.getAttribute('roomid') : res.data.userId, msg, time }, (response) => {
                if (response.status === 'ok') {
                    updateContacts(contacts, msg, time, userId, roomId)
                }
            })
            setMessage('')
        } catch (err) {
            toast.error(err.response)
        }
    }

    const handleChooseContact = (e, index) => {
        const contactItem = e.target.closest('.chat-conversations-item');
        if (selectingContact) {
            selectingContact.classList.remove('selecting');
            contactItem.classList.add('selecting');
            setSelectingContact(contactItem);
        } else {
            contactItem.classList.add('selecting');
            setSelectingContact(contactItem);
        }
    }

    // join to rooms
    useEffect(() => {
        const joinRooms = async () => {
            const res = await axios.get('/user/getRoomIds', {
                headers: { Authorization: token }
            })
            if (res.data.roomIds) {
                socket.emit('joinRoom', { roomIds: res.data.roomIds })
            }
            setContacts(res.data.contacts);
        }
        joinRooms();
    }, [socket, token])

    const updateContacts = useCallback((contacts, msg, time, senderId, roomId) => {
        const getConversationId = () => {
            for (let i = 0; i < contacts.length; i++) {
                console.log('contact id: ' + contacts[i].roomId)
                if (contacts[i].roomId === roomId) return i;
            }
        }
        const conversationId = getConversationId();
        const newContacts = contacts.map((contact, index) => {
            if (index === conversationId) {
                contact.messages = [...contact.messages, {
                    id: senderId,
                    content: msg,
                    time: time
                }]
            }
            return contact
        })
        setContacts(newContacts);

        // scroll messages to bottom
        if (selectingContact && +selectingContact.getAttribute('index') === conversationId) {
            const messagesEle = document.querySelector('.messages-body');
            messagesEle.scrollTo(0, messagesEle.scrollHeight)
        }
    }, [selectingContact])

    const handleEnterEvent = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            console.log('enters')
            console.log('message: ' + message)
            handleSendMessage();
        }
    }

    // send message when press enter
    useEffect(() => {
        if (selectingContact) {
            document.querySelector('.messages-footer-textarea').addEventListener('keypress', handleEnterEvent);
        }

        return () => {
            if (selectingContact) document.querySelector('.messages-footer-textarea').removeEventListener('keypress', handleEnterEvent);
        }
    })

    // scroll messages to bottom
    useEffect(() => {
        if (selectingContact) {
            const messagesEle = document.querySelector('.messages-body');
            messagesEle.scrollTo(0, messagesEle.scrollHeight)
        }
    })

    // CLEAN LISTENER TO EVENT when componentDidUpdate
    useEffect(() => {
        socket.on('updateMessages', ({ msg, time, senderId, roomId }) => {
            console.log(msg + ' ' + time + ' ' + senderId + ' ' + roomId);
            console.log('updating ...')
            updateContacts(contacts, msg, time, senderId, roomId);
        })
        return () => {
            socket.off('updateMessages');
        }
    }, [socket, updateContacts, contacts])

    return (
        <HeadlessTippy
            interactive={true}
            animation={'true'}
            trigger={'click'}
            onTrigger={(instance) => {
                if (selectingContact) {
                    console.log(selectingContact);
                    const messagesEle = document.querySelector('.messages-body');
                    setTimeout(() => console.log(messagesEle), 2000);
                    // messagesEle.scrollTo(0, messagesEle.scrollHeight)
                }
                setChatPopperInstance(instance);
            }}
            onHide={(instance) => {
                // perform your hide animation in here, then once it completes, call
                // instance.unmount()
                // unmount must be async
                requestAnimationFrame(instance.unmount);
                // instance.hide();
            }}
            render={() => {
                return <div className='chat-popper'>
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <span style={{
                                fontSize: '1.6rem',
                                fontWeight: '500',
                                transform: 'translateX(-2px)'
                            }}>Chat</span>
                            <div className='chat-header-unread-messages'>(3)</div>
                        </div>
                        <div className="chat-header-actions">
                            <DownIcon className='arrow-icon' clickHandler={() => {
                                chatPopperInstance.hide()
                            }}></DownIcon>
                        </div>
                    </div>
                    <div className="chat-body">
                        <div className="chat-messages">
                            {
                                (selectingContact && contacts.length > 0) ?
                                    <>
                                        {console.log('contacts: ' + contacts)}
                                        {console.log('selectingContact: ' + contacts[selectingContact.getAttribute('index')].user.name)}
                                        <div className="messages-header">
                                            <h4>{contacts[selectingContact.getAttribute('index')].user.name}</h4>
                                        </div>
                                        <div className="messages-body">
                                            {contacts[selectingContact.getAttribute('index')].messages.map((message, index) => {
                                                return (<div key={index} className={message.id !== userId ? 'messages-body-item-wrapper other' : 'messages-body-item-wrapper mine'}>
                                                    <div className={message.id !== userId ? 'messages-body-item other' : 'messages-body-item mine'}>
                                                        {message.content}
                                                    </div>
                                                </div>)
                                            }
                                            )}
                                        </div>
                                        <div className="messages-footer">
                                            <textarea
                                                className="messages-footer-textarea"
                                                onChange={(e) => {
                                                    setMessage(e.target.value)
                                                }}
                                                value={message}
                                                name="" id="" placeholder="Send message" cols="30" rows="10"
                                            >
                                            </textarea>
                                            <div className={message ? 'messages-footer-send ready' : 'messages-footer-send'}>
                                                <SendIcon handleClick={handleSendMessage} readyToSend={message ? true : false} />
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div style={{ width: '100%', height: '100%', minWidth: '255px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon style={{ fontSize: '72px' }} icon={['far', 'comment']} />
                                    </div>
                            }
                        </div>
                        {true &&
                            <div className="chat-conversations">
                                {contacts.map((contact, index) =>
                                    <div key={index} className="chat-conversations-item" index={index} roomid={contact.roomId} onClick={(e) => {
                                        handleChooseContact(e, index)
                                    }}>
                                        <div className='chat-item-contact'>
                                            <img src={contact.user.images ? contact.user.images.url : 'https://www.eduvidya.com/admin/Upload/Schools/637546977339653925_no%20image.png'} className='chat-item-avt' alt="/" />
                                            <div className="chat-item-info">
                                                <h3 className="chat-item-name">{contact.user.name}</h3>
                                                <div className="chat-item-info-bottom">
                                                    <p className='chat-item-last-message'>{contact.messages[contact.messages.length - 1].content}</p>
                                                    <p className='chat-item-latest-seen'>
                                                        {
                                                            (() => {
                                                                const relativeTime = (formatRelative(new Date(contact.messages[contact.messages.length - 1].time), new Date())).toString()
                                                                const arr = relativeTime.split(' ');

                                                                if (arr[0] === 'today') return arr[2] + ' ' + arr[3];
                                                                else return arr[0];
                                                            })()
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </ div>
            }
            }

        >
            <div className="chat-btn">
                <span className='chat-btn-text'>Chat</span>
                <FontAwesomeIcon className="chat-icon" icon={['far', 'message']} />

                <div className="chat-unread-messages">
                    <span className='unread-messages'>3</span>
                </div>
            </div>
        </HeadlessTippy>

    );
}

export default Chat;