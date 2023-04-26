import {useState, useEffect, useRef} from 'react';
import { NavLink, useNavigate} from 'react-router-dom';
import { Form, Button, ListGroup, Col, Row } from 'react-bootstrap';
import "./ChatFrame.css";
import axios from 'axios';
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const ChatFrameComponent = (props) => {
    const navigate = useNavigate();
    const user = props.user;
    const [users, setUsers] = useState([])
    const [currentSelected, setCurrentSelected]  = useState()
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat]= useState(undefined);
    const changeCurrentChat = (index, user) => {
        setCurrentSelected(index);
        setCurrentChat(user)
    };
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const scrollRef = useRef();
    const socket = useRef();
    console.log(`picture here: ${props.user.password}`)

    useEffect(() => {
        axios
            .get("/users")
            .then((res) => {
                var newArray = res.data.filter(function(contact) {return contact.username != user.username})
                setUsers(newArray)
            })
            .catch((err) => {
                console.log(`Error retrieving Users ${err}`)
            })
    }, [user])

    useEffect(() => {
        if(user) {
            socket.current = io(user);
            socket.current.emit("add-user",user._id);
        }
    }, [user])
    useEffect( () => {
        if (currentChat != undefined) {
            console.log(`user id: ${user._id}`)
            console.log(`receiver id: ${currentChat._id}`)
            axios
                .post("/messages/getmsg", {
                    from: user._id,
                    to:currentChat._id,
                    })
                .then((res) => {
                    setMessages(res.data)
                    console.log(res);
                })
                .catch((err) => {
                    console.log(`Error retrieving messages ${err}`);
                })
        }
        
        
    }, [currentChat,user])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(msg.length > 0) {
            // set handle message
            await axios
                        .post("/messages/addmsg", {
                            from: user._id,
                            to: currentChat._id,
                            message: msg,
                        })
            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: user,
                message: msg,
            });

            const msgs = [...messages];
            msgs.push({ fromSelf:true,message:msg });
            setMessages(msgs);
            setMsg("");
        }
    }

    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-receive", (msg) => {
                setArrivalMessage({fromSelf:false,message:msg});
            })
        }
    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    }, [messages])
    const handleLogout = (event) => {
        event.preventDefault();
        navigate(-1);
    }

    const handleEmojiClick = (emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        console.log(`Message: ${message}`)
        setMsg(message);
    }
    
    return (
        <div className='ChatContainer'>
            <div className='SidebarContainer'>
                <div className='AccountPanel'>
                    <div>
                        <img src={`${user.picture}`} style={{width: 30, height: 30, marginRight: 10, objectFIt: 'cover', borderRadius:"50%"}} />
                    </div>
                    <div>
                        <h2>{user.username}</h2>
                    </div>
                    <Button className='LogoutBtn' onClick={handleLogout}>Logout</Button>
                </div>
                
                <div className='ContactListContainer'>
                    <h2>Contacts</h2>
                        {users.map((user, index) => {
                            return(
                                <div className={`contact ${
                                    index === currentSelected ? "selected" : ""
                                    }`}
                                    key={index}
                                    onClick={() => changeCurrentChat(index, user)}
                                >
                                    <div className='avatar'>
                                        <img src={user.picture}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className='username'>
                                        <h3>{user.username}</h3>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>

            <div className='ChatMessageContainer'>
                <div className='ChatMainBody'>
                    {currentChat === undefined ? (
                        <div className='Welcome'>
                            <h3>Welcome {user.username}!</h3>
                            <p>Please select a contact to chat with</p>
                        </div>
                    ) : (
                        <div className='SelectedChatBody'>
                            <div className='chat-header'> 
                                <div className='user-details'>
                                    <div className='avatar'>
                                        <img
                                            src={currentChat.picture}
                                        />
                                    </div>
                                    <div className='username'>
                                        <h3>{currentChat.username}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='chat-messages'>
                                {
                                    messages.map((message) => {
                                        return (
                                            <div ref={scrollRef} key={uuidv4()}>
                                                <div className={`message ${message.fromSelf ? "sended":"received"}`}>
                                                    <div className='content'>
                                                        <p>{message.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )} 
                </div>
                <div className='messages-output'>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={11}>
                                <Form.Group className='input-container'>
                                    <Form.Control type="text" placeholder="Your Message" value={msg} onChange={(e)=>setMsg(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <div className='button-container'>
                                    <div className='emoji'>
                                        <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
                                        {
                                            showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>
                                        }
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className='msgButton'
                                        style={{ width: "100%", height:"100%", backgroundColor: "#9a86f3", border: "none"}}
                                        >
                                        <i class="bi bi-send-fill"></i>
                                    </Button>
                                </div>
                                
                            </Col>
                        </Row>
                    </Form>
                </div>
                
                
            </div>
            
        </div>
    )
}

export default ChatFrameComponent;