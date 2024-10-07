import React, { useEffect, useState,useContext } from "react"
import { Row, Col, Pagination, Form, Button } from "react-bootstrap"
import BadgerMessage from "./BadgerMessage"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [page,setPage] = useState(1); // page number in pagination unit
    
    const [loginStatus,setLoginStatus] = useContext(BadgerLoginStatusContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${page}`, { // change the hard code here
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
            //console.log(json.messages)
            //console.log(messages.length);
            //console.log(page);
        })
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props, page]);//[props]

    const handleSetPage = (pageNum) => {
        setPage(pageNum);
        //loadMessages();
    }

    // create posts (controlled input components)
    const handlePostSubmit = (e) => {
        e?.preventDefault();

        if(!loginStatus.isLoggedIn){ // if the user is not yet authenticated
            alert('You must be logged in to post!');
            return;
        }

        if(!title || !content){ // If the user does not enter a title or content
            alert('You must provide both a title and content!');
            return;
        }

        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title, content})
        })
        .then(res => res.json())
        .then(() => {
            alert('Successfully posted!'); // alert 
            setTitle(''); // Clear the title state for new
            setContent(''); // Clear the content state for new
            loadMessages(); // refresh autoly
        })
    }

    const handleDelete = (messageId) => {
        fetch(`https://cs571.org/api/s24/hw6/messages?id=${messageId}`, { 
            method: 'DELETE',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(res => {
            //console.log(res.status); 
            alert('Successfully deleted the post!');// status 200
            // 400, 401, 404
            loadMessages();
        })
    }

    return (<>
        <h1>{props.name} Chatroom</h1>
        <>
        {
            /* TODO: Allow an authenticated user to create a post. */
            
                <Form onSubmit={handlePostSubmit}>
                    <Form.Label htmlFor='titleInput'>Post title</Form.Label>
                    <Form.Control id='titleInput'
                                  type='text'
                                  value={title}
                                  onChange={e => setTitle(e.target.value)}
                                  placeholder='Enter post title here...'/>
                    <br/>
                    <Form.Label htmlFor='contentInput'>Post content</Form.Label>
                    <Form.Control id='contentInput'
                                  type='text'
                                  value={content}
                                  onChange={e => setContent(e.target.value)}
                                  placeholder="Enter post content here..."/>
                    <br/>
                    <Button type='submit' onClick={handlePostSubmit}>Post</Button>
                </Form>
        }
        </>
        <hr/>
        {
            messages.length > 0 ? (
                <Row>
                    {messages.map((message, index) => (
                        <Col xs={12} sm={12} md={6} lg={4} xl={3} key={index}>
                            <BadgerMessage  title={message.title} 
                                            poster={message.poster}
                                            content={message.content}
                                            created={message.created}
                                            isOwn={loginStatus.username === message.poster}
                                            onDelete={() => handleDelete(message.id)} 
                            />
                        </Col>
                    ))}
                    {/* TODO: Complete displaying of messages. */}
                </Row>
            ) : (
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        )}
        <Pagination>
            {[1, 2, 3, 4].map((pageNum) => (
                <Pagination.Item
                    key={pageNum}
                    onClick={() => handleSetPage(pageNum)}
                    active={pageNum === page}
                >
                    {pageNum}
                </Pagination.Item>
            ))}
        </Pagination>
    </>
    );
}
